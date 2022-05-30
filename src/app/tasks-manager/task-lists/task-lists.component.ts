import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormControl, Validators } from '@angular/forms';
import { IBoard, IColumn } from '../interfaces/taskList.interface';
import { TasksManagerService } from '../tasks-manager.service';
import { ErrorStateMatcher } from '@angular/material/core';

export class LengthErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl): boolean {
    if (control && control?.value.trim().length < 4) {
      return control.invalid && (control.dirty || control.touched);
    }
    
    return false;
  }
}

@Component({
  selector: 'app-task-lists',
  templateUrl: './task-lists.component.html',
  styleUrls: ['./task-lists.component.scss'],
})
export class TaskListsComponent implements OnInit {
  isColumnChangeOpen = new Map();
  isTaskAddOpen = new Map();
  isColumnAddOpen: boolean = false;
  matcher = new LengthErrorStateMatcher();
  board!: IBoard;
  columns!: IColumn[];
  author = 'Заглушка';

  taskId!: number;

  public newColumn!: FormControl;
  public newTask!: FormControl;

  public formChangeName: any[] = [];

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  constructor(
    private taskServ: TasksManagerService
  ) {
    this.newTask = new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(100),
    ]);

    this.newColumn = new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
    ]);
  }

  ngOnInit(): void {
    this.taskServ.getBoard().subscribe((board) => {
      board.columns.forEach((column) => {
        this.taskServ.getColumn(column.id).subscribe((res) => {
          column.tasks = res.tasks;
          this.board = board;
        });
        this.isColumnChangeOpen.set(column.id, false);
        this.isTaskAddOpen.set(column.id, true);
        this.formChangeName.push({
          id: column.id,
          control: new FormControl(column.title, Validators.minLength(4)),
        });
      });
    });
  }

  onColumnHeaderClick(id: number): void {
    this.isColumnChangeOpen.set(id, true);
    this.input.nativeElement?.focus();
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

  addToDo(columnId: number) {
    this.isTaskAddOpen.set(columnId, true);

    this.taskServ
      .createTask(columnId, this.newTask.value, this.board.id, this.author)
      .subscribe((task) => {
        this.board.columns.forEach((column) => {
          if (column.id === columnId) {
            column.tasks?.push(task);
          }
        });
      });
    this.newTask.reset();
  }

  addColumn() {
    this.taskServ.createColumn(1, this.newColumn.value).subscribe((column) => {
      this.board.columns.push(column);
    });
    this.newColumn.reset();
    this.isColumnAddOpen = false;
  }

  changeName(event: any, id: number, title: string) {
    if (event.target.value.trim() !== title && event.target.value.length >= 4) {
      this.taskServ.editColumn(id, event.target.value).subscribe(() => {
        this.board.columns[this.findColumnIdx(id)].title = event.target.value;
        this.isColumnChangeOpen.set(id, false);
        this.isTaskAddOpen.set(id, true);
      });
    }
  }

  deleteColumn(id: number) {
    this.taskServ.deleteColumn(id).subscribe((id) => {
      this.board.columns.splice(this.findColumnIdx(id), 1);
    });
    this.isColumnChangeOpen.delete(id);
    this.isTaskAddOpen.delete(id);
    this.newColumn.reset();
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
        taskIdx = i;
      }
    }
    return taskIdx;
  }

  deleteTask($event: Event, id: number, columnId: number) {
    $event.stopPropagation();
    this.taskServ.deleteTask(id).subscribe((id) => {
      const columnIdx = this.findColumnIdx(columnId);
      const taskIdx = this.findTaskIdx(id, columnIdx);
      this.board.columns[columnIdx].tasks?.splice(taskIdx, 1);
    });
  }
}
