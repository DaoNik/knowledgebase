import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { TasksManagerService } from '../../tasks-manager.service';

@Component({
  selector: 'app-assignee-modal',
  templateUrl: './assignee-modal.component.html',
  styleUrls: ['./assignee-modal.component.scss']
})
export class AssigneeModalComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<AssigneeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskManagerService: TasksManagerService
    ) { }
    
  searchAssigneeQuery = new FormControl(['']);
  assignee: string[] = []
  filteredOptions!: Observable<string[]>;
  subscriptionEdit$!: Subscription;
  mockUsers: string[] = [
    'Никита Таранин', 'Леолид Леолидыч', 'Александр Яунберзиньш', 'Димон'
  ];

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
    this.subscriptionEdit$ = this.taskManagerService.editTask(Number(this.data[0].taskId), {
      respondents: this.data[0].taskAssignee,
    }).subscribe(res => {
      console.log(res.respondents)
      this.data[0].taskAssignee = res.respondents;
    });
  }

  ngOnInit(): void {
    console.log(this.data[0])
    console.log(this.mockUsers)
    this.filteredOptions = this.searchAssigneeQuery.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  ngOnDestroy() {
    this.subscriptionEdit$.unsubscribe();
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
