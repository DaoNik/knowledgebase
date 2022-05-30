import { Component, OnInit } from '@angular/core';
import { ErrorModalService } from './error-modal.service';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit {

  constructor(private errorService: ErrorModalService) { }

  public messageText: string = '';

  ngOnInit(): void {
    this.messageText = this.errorService.errorMessage;

    setTimeout(() => {
    this.errorService.visibleError = false
    }, 10000)
  }

  closeModal(): void {
    this.errorService.changeVisible()
  }

}