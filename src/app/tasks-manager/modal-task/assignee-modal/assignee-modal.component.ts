import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { TasksManagerService } from '../../tasks-manager.service';

@Component({
  selector: 'app-assignee-modal',
  templateUrl: './assignee-modal.component.html',
  styleUrls: ['./assignee-modal.component.scss']
})
export class AssigneeModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AssigneeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskManagerService: TasksManagerService
    ) { }
    
  searchAssigneeQuery = new FormControl(['']);
  assignee: string[] = []
  filteredOptions!: Observable<string[]>;
  mockUsers: string[] = [
    'Никита Таранин', 'Леолид Леолидыч', 'Александр Яунберзиньш', 'Димон'
  ];
  dataChanged = false;

  onNoClick(): void {
    console.log('click out')
    this.dialogRef.close(this.dataChanged);
  }

  addAssignee(option: string): void {
    if (this.data[0].taskAssignee) this.data[0].taskAssignee.push(option);
    else this.data[0].taskAssignee = [option];
    this.searchAssigneeQuery.setValue('');
    this.updateData();
  }

  deleteAssignee(index: number): void {
    this.data[0].taskAssignee.splice(index, 1);
    this.updateData();
  }

  updateData() {
    this.taskManagerService.editTask(Number(this.data[0].taskId), {
      authors: this.data[0].taskAssignee,
    }).subscribe(res => {
      this.data[0].taskAssignee = res.authors;
    });
    this.dataChanged = true;
  }

  ngOnInit(): void {
    this.filteredOptions = this.searchAssigneeQuery.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    // const arrOfUsedNames = this.taskData.value.assignee ? this.taskData.value.assignee.map((i: string) => i) : []

    return this.mockUsers.filter((user: string) => (
      user.toLowerCase().includes(filterValue) 
      // && !!!this.data.taskAssignee.includes(user)
    ));
  }

}
