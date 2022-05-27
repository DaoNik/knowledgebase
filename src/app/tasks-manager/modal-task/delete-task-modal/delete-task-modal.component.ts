import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TasksManagerService } from '../../tasks-manager.service';
import { ModalTaskComponent } from '../modal-task.component';

@Component({
  selector: 'app-delete-task-modal',
  templateUrl: './delete-task-modal.component.html',
  styleUrls: ['./delete-task-modal.component.scss']
})
export class DeleteTaskModalComponent implements OnInit {

  constructor(
    public dialogDel: MatDialogRef<DeleteTaskModalComponent>,
    public dialogRef: MatDialogRef<ModalTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public id: any,
    private taskManagerService: TasksManagerService) { }

  ngOnInit(): void {
    console.log(this.id)
  }

  deleteTask() {
    this.taskManagerService.deleteTask(this.id)
    .subscribe();
    this.dialogRef.close(true);
  }

  closeModal() {
    this.dialogDel.close(false);
  }

}
