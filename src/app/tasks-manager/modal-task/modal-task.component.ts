import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IAssignee, ITaskData } from './modal-task-interface';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.scss']
})
export class ModalTaskComponent implements OnInit {
  mockTaskData = this.fb.group({
    title: [this.data],
    status: ['In progress'],
    assignee: 
      [[{
        name: 'Giovanni Gorgio', 
        id: 1,
        avatar: ''
      },{
        name: 'Bruh Bruv', 
        id: 2,
        avatar: ''
      }]]
    ,
    description: ['Короткое описание задачи'],
    text: [[{
      text: 'Пункт 1', 
      type: 'ul',
      value: 'false'
    },{
      text: 'Пункт 2', 
      type: 'todo',
      value: 'true'
    }]]
  });
  mockStatusVariants = ['Todo', 'In progress', 'Done']
  mockUsers = [
    {
      name: 'Giovanni Gorgio', 
      id: 1,
      avatar: ''
    },{
      name: 'Bruh Bruv', 
      id: 2,
      avatar: ''
    },{
      name: 'Another User', 
      id: 3,
      avatar: ''
    },{
      name: 'Darth Vader', 
      id: 4,
      avatar: ''
    }
  ]
  typeOptions = [{
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
  createOption = {
    name: 'text',
    type: '',
    value: ''
  };
  searchAssigneeQuery = new FormControl(['']);
  filteredOptions!: Observable<IAssignee[]>;

  constructor(
    public dialogRef: MatDialogRef<ModalTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}
  

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  dummy(a: any) {
    console.log(a)
  }

  addText(e: any, num: number) {
    if (num == -1) {
      this.mockTaskData.value.text.push({
        text: e.target.value, 
        type: this.createOption.type,
        value: this.createOption.value
      })
      e.target.value = '';
      this.createOption.type = '';
      this.createOption.value = '';
    } else {
      this.mockTaskData.value.text[num].text = e.target.value;
    }
    this.inputTrigger = false;
    console.log(this.mockTaskData.value.text)
  }

  changeType(option: any, i: number) {
    if (i >= 0){
      this.mockTaskData.value.text[i].type = option.type;
      this.mockTaskData.value.text[i].value = option.value;
    } else {
      this.createOption.type = option.type;
      this.createOption.value = option.value;
    }
  }

  deleteString(i: number) {
    this.mockTaskData.value.text.splice(i, 1);
  }

  ngOnInit(): void {
    this.filteredOptions = this.searchAssigneeQuery.valueChanges.pipe(
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): IAssignee[] {
    const filterValue = value.toLowerCase();

    return this.mockUsers.filter(user => (
      user.name.toLowerCase().includes(filterValue) && 
      !this.mockTaskData.value.assignee.includes(user)
    ));
  }
}