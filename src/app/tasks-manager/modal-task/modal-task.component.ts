import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITypeOption } from './modal-task-interface';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { map, Observable, startWith, timeout } from 'rxjs';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalTaskService } from './modal-task.service';
import { TasksManagerService } from '../tasks-manager.service';
import { HttpClient } from '@angular/common/http';
import { AssigneeModalComponent } from './assignee-modal/assignee-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IBoard } from '../interfaces/taskList.interface';
import { DeleteTaskModalComponent } from './delete-task-modal/delete-task-modal.component';

@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.scss']
})
export class ModalTaskComponent implements OnInit, OnDestroy {
  // taskData = this.fb.group({
  //   title: ['Title', Validators.minLength(4)],
  //   id: this.data,
  //   status: ['In progress'],
  //   column: ['Третий столбец'],
  //   assignee: 
  //     [[{
  //       name: 'Giovanni Gorgio', 
  //       id: 1,
  //       avatar: ''
  //     },{
  //       name: 'Bruh Bruv', 
  //       id: 2,
  //       avatar: ''
  //     }]]
  //   ,
  //   description: ['Короткое описание задачи'],
  //   text: [[{
  //     text: 'Пункт 1', 
  //     type: 'ul',
  //     value: 'false'
  //   },{
  //     text: 'Пункт 2', 
  //     type: 'todo',
  //     value: 'true'
  //   }]]
  // });
  recievedData: any;
  taskData = this.fb.group({
    title: ['Title', Validators.minLength(4)],
    id: this.data,
    status: [],
    column: [],
    columnId: [],
    board: [],
    boardId: [],
    priority: [],
    assignee: [[]],
    contact: [],
    text: [[]],
    dateCreated: [],
    dateUpdated: []
  });
  columns: any = []
  boards: any = []
  statusVariants: string[] = ['Todo', 'In progress', 'Done'];
  priorityVariants: string[] = ['None', 'Low', 'Medium', 'High'];
  typeOptions: ITypeOption[] = [{
    name: 'text',
    type: '',
    value: ''
  },
  {
    name: 'ToDo',
    type: 'todo',
    value: 'false'
  },
  {
    name: 'List',
    type: 'ul',
    value: ''
  }]
  inputTrigger = false;
  headerTrigger = false;
  sidebarEditTrigger = false;
  createOption: ITypeOption = {
    name: 'text',
    type: '',
    value: ''
  };
  inputFile: string = '';
  fileUploaded = false;

  subscriptionTask$!: Subscription;
  subscriptionColumn$!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<ModalTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialog: MatDialog,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private modalTaskServ: ModalTaskService,
    private taskManagerService: TasksManagerService,
    private _snackBar: MatSnackBar
  ) {}
  

  onNoClick(): void {
    this.dialogRef.close();
  }

  addText(e: any, num: number) {
    if (num == -1) {
      if (!this.taskData.value.text) {
        this.taskData.value.text = [{
          text: e.target.value, 
          type: this.createOption.type,
          value: this.createOption.value
        }]
      } else {
        this.taskData.value.text.push({
          text: e.target.value, 
          type: this.createOption.type,
          value: this.createOption.value
        })
      }
      e.target.value = '';
      this.createOption.type = '';
      this.createOption.value = '';
    } else {
      this.taskData.value.text[num].text = e.target.value;
    }
    this.inputTrigger = false;
    this.updateTaskData();
  }

  changeStatus(status: string) {
    this.taskData.value.status = status;
    this.updateTaskData();
  }

  changeColumn(column: any) {
    this.taskData.value.column = column.title;
    this.taskData.value.columnId = column.id;
    this.updateTaskData();
  }

  changeTitle() {
    this.headerTrigger = !this.headerTrigger;
    this.updateTaskData();
  }

  changeType(option: any, i: number) {
    if (i >= 0) {
      this.taskData.value.text[i].type = option.type;
      this.taskData.value.text[i].value = option.value;
    } else {
      this.createOption.type = option.type;
      this.createOption.value = option.value;
    }
    this.updateTaskData();
  }

  urlCopy() {
    navigator.clipboard.writeText(window.location.href);
    this._snackBar.open('Ссылка скопирована!');
    setTimeout(() => {this._snackBar.dismiss()}, 1000)
  }

  deleteString(i: number) {
    this.taskData.value.text.splice(i, 1);
    this.updateTaskData();
  }

  // addAssignee(option: string): void {
  //   this.taskData.value.assignee.push(option);
  //   this.searchAssigneeQuery.setValue('');
  //   this.updateTaskData();
  // }

  removeAssignee(index: number): void {
    this.taskData.value.assignee.splice(index, 1);
    this.updateTaskData();
  }

  editSidebar() {
    if (this.sidebarEditTrigger == true) this.updateTaskData();
    this.sidebarEditTrigger = !this.sidebarEditTrigger;
  }

  showAndEditAssignee(edit: boolean) {
    const data = [{
      edit: edit, 
      taskId: this.taskData.value.id,
      taskAssignee: this.taskData.value.assignee
    }]

    const dialogRef = this.dialog.open(AssigneeModalComponent, {
        panelClass: 'edit-assignee-global',
        data: data,
    });

    dialogRef.afterClosed().subscribe(() => {
        this.uploadTaskData();
    });
  }

  fileInputChange(input: any) {
    if (!!input.files[0]) {
      this.inputFile = input.files[0].name
      this.fileUploaded = true;
      setTimeout(() => {
        this.fileUploaded = false;
      }, 1000)
    }
  }

  ngOnInit(): void {
    this.uploadTaskData();
  }

  ngOnDestroy(): void {
    this.subscriptionTask$.unsubscribe();
    this.subscriptionColumn$.unsubscribe();
  }

  updateTaskData() {
    const updatedData = {
      title: this.taskData.value.title,
      status: this.taskData.value.status == '' ? 'Todo' : this.taskData.value.status,
      column: this.taskData.value.column,
      columnId: this.taskData.value.columnId,
      departments: this.taskData.value.assignee,
      priority: this.taskData.value.priority == '' ? 'None' : this.taskData.value.priority,
      contact: this.taskData.value.contact,
      description: JSON.stringify(this.taskData.value.text)
    }
    this.taskManagerService.editTask(Number(this.data), updatedData).subscribe(res => {
      this.taskData.patchValue({
        title: res.title,
        assignee: res.departments,
        status: res.status,
        columnId: res.columnId,
        priority: res.priority,
        dateCreated: this._dateTransform(res.createdAt),
        dateUpdated: this._dateTransform(res.updatedAt)
      });
    });
  }

  uploadTaskData() {
    const url = this.router.url.split('/')
    this.subscriptionTask$ = this.taskManagerService.getTask(Number(url[url.length - 1])).subscribe((res: any) => {
      console.log(res)
      this.taskData.patchValue({
        title: res.title,
        assignee: res.departments,
        status: res.status,
        boardId: res.boardId,
        columnId: res.columnId,
        priority: res.priority,
        contact: res.contact,
        dateCreated: this._dateTransform(res.createdAt),
        dateUpdated: this._dateTransform(res.updatedAt)
      });

      if (res.description.length > 0) {
        this.taskData.patchValue({
          text: JSON.parse(res.description)
        });
      }
    })

    this.subscriptionColumn$ = this.taskManagerService.getColumns().subscribe(columns => {
        this.columns = columns;
        columns.map((column: any) => {
        if (column.id == this.taskData.value.columnId) {
          this.taskData.patchValue({
            column: column.title
          });
        }
      })
    })

    this.taskManagerService.getBoard().subscribe((res: IBoard) => {
      console.log(res)
      this.boards = [res]
      if (res.id === this.taskData.value.boardId) {
        this.taskData.patchValue({
          board: res.title
        });
      }
    })
  }

  private _dateTransform(date: string): string {
    return `${date.slice(0, 10)} ${date.slice(11, 19)}`
  }

  deleteTask() {
    const dialogDel = this.dialog.open(DeleteTaskModalComponent, {
      panelClass: 'delete-modal-global',
      data: this.taskData.value.id,
    });

    dialogDel.afterClosed().subscribe((res) => {
      if (res) this.dialogRef.close(true);
    });
  }
}