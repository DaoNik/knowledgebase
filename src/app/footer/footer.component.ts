import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackComponent } from './feedback/feedback.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  constructor(public dialog: MatDialog) {}

  openFeedbackForm() {
    this.dialog.open(FeedbackComponent, {
      maxWidth: '100%',
      width: '550px'
    });
  }
}
