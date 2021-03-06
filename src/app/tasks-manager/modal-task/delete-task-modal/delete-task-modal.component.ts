import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TasksManagerService } from '../../tasks-manager.service';
import { ModalTaskComponent } from '../modal-task.component';

@Component({
  selector: 'app-delete-task-modal',
  templateUrl: './delete-task-modal.component.html',
  styleUrls: ['./delete-task-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteTaskModalComponent {
  constructor(
    public dialogDel: MatDialogRef<DeleteTaskModalComponent>,
    public dialogRef: MatDialogRef<ModalTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public id: any,
    private taskManagerService: TasksManagerService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  deleteTask() {
    this.taskManagerService.deleteTask(this.id)
    .subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
    this.dialogRef.close(true);
  }

  closeModal() {
    this.dialogDel.close();
  }
}
