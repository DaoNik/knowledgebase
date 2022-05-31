import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent {
  feedback: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.feedback = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern(/[А-я]/)]],
      userId: ['', [Validators.required]],
      text: ['', [Validators.minLength(10)]],
    });
  }
}
