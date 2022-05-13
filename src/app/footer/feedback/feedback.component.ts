import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  feedback: FormGroup;
  constructor(private fb: FormBuilder) {
    this.feedback = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern(/[А-я]/)]],
      userId: ['', [Validators.required]],
      text: [
        '',
        [
          Validators.minLength(10),
          Validators.pattern(
            '^[a-zA-Z0-9а-яёА-ЯЁ]*[-_— .@]?[a-zA-Z0-9а-яёА-ЯЁ]*.?[a-zA-Z0-9а-яёА-ЯЁ]*$'
          ),
        ],
      ],
    });
  }
  ngOnInit(): void {}
}
