import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IAssignee, ITaskData, ITypeOption } from './modal-task-interface';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { map, Observable, startWith } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ModalTaskService } from './modal-task.service';
import { TasksManagerService } from '../tasks-manager.service';

@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.scss']
})
export class ModalTaskComponent implements OnInit {
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
    assignee: [[]],
    text: [[]],
    dateCreated: [],
    dateUpdated: []
  });
  columns: any = []
  mockUsers: string[] = [
    'Никита Таранин', 'Леолид Леолидыч', 'Александр Яунберзиньш', 'Димон'
  ];
  statusVariants: string[] = ['Todo', 'In progress', 'Done'];
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
  createOption: ITypeOption = {
    name: 'text',
    type: '',
    value: ''
  };
  searchAssigneeQuery = new FormControl(['']);
  filteredOptions!: Observable<string[]>;
  inputFile: string = '';
  fileUploaded = false;

  constructor(
    public dialogRef: MatDialogRef<ModalTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private modalTaskServ: ModalTaskService,
    private taskManagerService: TasksManagerService
  ) {}
  

  onNoClick(): void {
    this.dialogRef.close();
  }

  addText(e: any, num: number) {
    console.log(this.taskData.value.text)
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
    console.log(this.taskData.value.text)
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

  deleteString(i: number) {
    this.taskData.value.text.splice(i, 1);
    this.updateTaskData();
  }

  addAssignee(option: string): void {
    this.taskData.value.assignee.push(option);
    this.searchAssigneeQuery.setValue('');
    this.updateTaskData();
  }

  removeAssignee(index: number): void {
    this.taskData.value.assignee.splice(index, 1);
    this.updateTaskData();
  }

  copyUrl() {
    // console.log(this.router)
    navigator.clipboard.writeText(window.location.href);
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
    const url = this.router.url.split('/')
    this.taskManagerService.getTask(Number(url[url.length - 1])).subscribe((res: any) => {
      console.log(res)
      this.taskData.patchValue({
        title: res.title,
        assignee: res.respondents,
        status: res.status,
        columnId: res.columnId,
        dateCreated: this._dateTransform(res.createdAt),
        dateUpdated: this._dateTransform(res.updatedAt)
      });
      if (res.description.length > 0) {
        this.taskData.patchValue({
          text: JSON.parse(res.description)
        });
      }

      this.taskManagerService.getColumns().subscribe(columns => {
          this.columns = columns;
          columns.map((column: any) => {
          if (column.id == res.columnId) {
            this.taskData.patchValue({
              column: column.title
            });
            // console.log(`${column.id} == ${res.columnId} = ${column.id == res.columnId}`)
          }
        })
      })
    })
    this.filteredOptions = this.searchAssigneeQuery.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  updateTaskData() {
    const updatedData = {
      title: this.taskData.value.title,
      status: this.taskData.value.status,
      column: this.taskData.value.column,
      columnId: this.taskData.value.columnId,
      respondents: this.taskData.value.assignee,
      description: JSON.stringify(this.taskData.value.text)
    }
    this.taskManagerService.editTask(Number(this.data), updatedData).subscribe(res => {
      this.taskData.patchValue({
        title: res.title,
        assignee: res.respondents,
        status: res.status,
        columnId: res.columnId,
        dateCreated: this._dateTransform(res.createdAt),
        dateUpdated: this._dateTransform(res.updatedAt)
      });
    });
  }

  private _dateTransform(date: string): string {
    return `${date.slice(0, 10)} ${date.slice(11, 19)}`
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    // const arrOfUsedNames = this.taskData.value.assignee ? this.taskData.value.assignee.map((i: string) => i) : []

    return this.mockUsers.filter(user => (
      user.toLowerCase().includes(filterValue) && !!!this.taskData.value.assignee.includes(user)
    ));
  }

  deleteTask(id: number) {
    this.taskManagerService.deleteTask(id)
    .subscribe();
    this.dialogRef.close();
  }
}