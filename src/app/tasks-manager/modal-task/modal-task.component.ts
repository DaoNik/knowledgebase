import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ITaskData } from './modal-task-interface';
import { FormBuilder } from '@angular/forms';

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
        avatar: ''
      },{
        name: 'Bruh Bruv', 
        avatar: ''
      }]]
    ,
    description: ['Короткое описание задачи'],
    text: ['Длинное описание задачи']
  });

  constructor(
    public dialogRef: MatDialogRef<ModalTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    console.log(this.mockTaskData.value.assignee)
  }
}
