import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackComponent } from './feedback/feedback.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}
  openFeedbackForm(){
    this.dialog.open(FeedbackComponent, {
      maxWidth:'100%'
    })
  }
}
