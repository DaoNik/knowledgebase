import { FeedbackService } from './feedback.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent {
  feedback: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private feedbackService :FeedbackService,
    public dialog: MatDialog
  ) {
    this.feedback = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      userCode: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  sendFeedback(){
    this.feedbackService.sendFeedback(this.feedback.value).subscribe(()=> {
      this.dialog.closeAll();
      this.snackBar.open('Спасибо за обратную связь!');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 3000);
    })
  }
}


