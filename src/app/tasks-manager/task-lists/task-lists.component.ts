import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ModalTaskService } from '../modal-task/modal-task.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IBoard } from '../interfaces/taskList.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksManagerService } from '../tasks-manager.service';

@Component({
  selector: 'app-task-lists',
  templateUrl: './task-lists.component.html',
  styleUrls: ['./task-lists.component.scss'],
})
export class TaskListsComponent implements OnInit {
  changer: boolean = false;
  isHidden: boolean = false;
  isHiddenColumn: boolean = false;

  board!: IBoard;
  priority: string[] = ['Inconsiderable', 'Medium', 'Important'];
  status: string[] = ['To Do', 'In Progress', 'Done'];
  columnId!: number;
  taskId!: number;

  public form!: FormGroup;
  public formColumns!: FormGroup;

  constructor(
    private modalServ: ModalTaskService,
    private router: Router,
    private route: ActivatedRoute,
    private taskServ: TasksManagerService
  ) {
    this.form = new FormGroup({
      title: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
      priority: new FormControl("Medium", Validators.required),
      status: new FormControl("To Do", Validators.required)
    })
    this.formColumns = new FormGroup({
      columnName: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(50)])
    })
  }

  ngOnInit(): void {
    this.taskServ.getBoard()
    .subscribe((board) => {
      board.columns.forEach(column => {
        this.taskServ.getColumn(column.id).subscribe(res => {
          column.tasks = res.tasks;
          this.board =  board;
        })
      })
    })
  }

  drop(event: CdkDragDrop<any[]>, columnId: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    const updatedData = {
      columnId: columnId
    };
    this.taskServ.editTask(this.taskId, updatedData)
    .subscribe();
  }

  openTask(item: string) {
    this.modalServ.openDialog(item)
    this.router.navigate(['tasks-manager/tasks', item]);
  }

  addToDo(columnId: number) {
    this.isHidden = false;
    this.taskServ.createTask(columnId, this.form.value.title, this.form.value.priority, this.form.value.status)
    .subscribe();
    this.form.reset();
  }

  addColumn() {
    this.taskServ.createColumn(1, this.formColumns.value.columnName)
    .subscribe();
    this.isHiddenColumn = false;
  }

  changeName(event: any, id: number) {
    this.taskServ.editColumn(id, event.target.value)
    .subscribe();
    this.changer = false;
  }

  deleteColumn(id: number) {
    this.taskServ.deleteColumn(id)
    .subscribe();
    this.changer = false;
  }
}
