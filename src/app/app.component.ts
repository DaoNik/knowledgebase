import { Component, OnInit } from '@angular/core';
import { ErrorModalService } from './error-modal/error-modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'База знаний WB';
  visibleError!: boolean;

  constructor(private errorService: ErrorModalService) {}

  ngOnInit(): void {
    this.visibleError = this.errorService.visibleError;
  }

  ngAfterContentChecked(): void {
    this.visibleError = this.errorService.visibleError;
  }
}
