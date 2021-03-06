import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalTaskComponent } from './modal-task.component';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalTaskEntryComponent {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    const url = this.router.url.split('/');
    this.openDialog(url[url.length - 1].replace(/%20/g, ' '));
  }

  openDialog(data?: any): void {
    const dialogRef = this.dialog.open(ModalTaskComponent, {
      panelClass: 'modal-task-global',
      data: data,
      maxWidth: '900px',
      width: '90%',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['../'], { relativeTo: this.route });
      this.changeDetectorRef.markForCheck();
    });
  }
}
