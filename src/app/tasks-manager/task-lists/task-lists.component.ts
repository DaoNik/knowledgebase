import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ModalTaskService } from '../modal-task/modal-task.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IBoard } from '../interfaces/taskList.interface';
import { Router } from '@angular/router';
import { TasksManagerService } from '../tasks-manager.service';

@Component({
  selector: 'app-task-lists',
  templateUrl: './task-lists.component.html',
  styleUrls: ['./task-lists.component.scss'],
})
export class TaskListsComponent implements OnInit {
  changerColumn = new Map();
  isHidden: boolean = false;
  isHiddenColumn: boolean = false;

  board!: IBoard;
  priority: string[] = ['Inconsiderable', 'Medium', 'Important'];
  status: string[] = ['To Do', 'In Progress', 'Done'];
  columnId!: number;
  taskId!: number;

  public form!: FormGroup;
  public formColumns!: FormGroup;
  public formChangeName: any[] = [];

  constructor(
    private modalServ: ModalTaskService,
    private router: Router,
    private taskServ: TasksManagerService
  ) {
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100),
      ]),
      priority: new FormControl('Medium', Validators.required),
      status: new FormControl('To Do', Validators.required),
    });
    this.formColumns = new FormGroup({
      columnName: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
      ]),
    });
  }

  ngOnInit(): void {
    this.taskServ.getBoard().subscribe((board) => {
      board.columns.forEach((column) => {
        this.taskServ.getColumn(column.id).subscribe((res) => {
          column.tasks = res.tasks;
          this.board = board;
        });
        
        this.changerColumn.set(column.id, false);
        this.formChangeName.push({
          id: column.id,
          control: new FormControl(column.title, Validators.minLength(4)),
        });
      });
    });
  }

  onColumnHeaderClick(id: number): void {
    this.changerColumn.set(id, true);
    console.log(this.findFormcontrol(id));
  }

  findFormcontrol(id: number): FormControl {
    let res: FormControl = new FormControl();
    this.formChangeName.forEach((control) => {
      if (control.id === id) {
        res = control.control;
      }
    });
    return res;
  }

  getColumns(): void {
    this.taskServ.getBoard().subscribe((board) => {
      board.columns.forEach((column) => {
        this.taskServ.getColumn(column.id).subscribe((res) => {
          column.tasks = res.tasks;
          this.board = board;
        });
      });
    });
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
      columnId: columnId,
    };
    this.taskServ.editTask(this.taskId, updatedData).subscribe();
  }

  openTask(item: string) {
    this.modalServ.openDialog(item);
    this.router.navigate(['tasks-manager/tasks', item]);
  }

  addToDo(columnId: number) {
    this.isHidden = false;

    this.taskServ
      .createTask(
        columnId,
        this.form.value.title,
        this.board.id,
        this.form.value.priority,
        this.form.value.status
      )
      .subscribe((task) => {
        this.board.columns.forEach((column) => {
          if (column.id === columnId) {
            column.tasks?.push(task);
          }
        });
      });
    this.form.reset();
  }

  addColumn() {
    this.taskServ
      .createColumn(1, this.formColumns.value.columnName)
      .subscribe((column) => {
        this.board.columns.push(column);
        console.log('addColumn');
      });

    this.isHiddenColumn = false;
  }

  changeName(event: any, id: number, title: string) {
    if (event.target.value.trim() !== title && event.target.value.length >= 4) {
      this.taskServ.editColumn(id, event.target.value).subscribe(() => {
        this.board.columns[this.findColumnIdx(id)].title = event.target.value;
        this.changerColumn.set(id, false);
      });

    }
  }

  deleteColumn(id: number) {
    this.taskServ.deleteColumn(id).subscribe((id) => {
      this.board.columns.splice(this.findColumnIdx(id), 1);
    });
    this.changerColumn.delete(id);
    this.formColumns.reset();
  }

  findColumnIdx(columnId: number): number {
    let index: number = -1;
    this.board.columns.forEach((column) => {
      if (column.id === columnId) {
        index = this.board.columns.indexOf(column);
      }
    });
    return index;
  }

  findTaskIdx(taskId: number, columnIdx: number): number {
    const column = this.board.columns[columnIdx];
    let taskIdx = -1;

    for (let i = 0; i < column.tasks?.length!; i++) {
      if (column.tasks![i].id === taskId) {
        taskIdx === i;
      }
    }
    return taskIdx;
  }

  deleteTask(id: number, columnId: number) {
    this.taskServ.deleteTask(id).subscribe((id) => {
      const columnIdx = this.findColumnIdx(columnId);
      const taskIdx = this.findTaskIdx(id, columnIdx);
      this.board.columns[columnIdx].tasks?.splice(taskIdx, 1);
    });
  }
}
