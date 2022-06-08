import { ChangeDetectorRef, Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalTaskComponent } from './modal-task.component';

@Injectable({
  providedIn: 'root',
})
export class ModalTaskService {
  constructor(
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  openDialog(data?: any): void {
    const dialogRef = this.dialog.open(ModalTaskComponent, {
      panelClass: 'modal-task-global',
      data: data,
      maxWidth: '900px',
      width: '90%',
    });

    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
      this.changeDetectorRef.markForCheck();
    });
  }
}
