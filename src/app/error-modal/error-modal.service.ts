import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorModalService {

  constructor() {}

  public visibleError: boolean = false;
  public errorMessage: string = '';

  public changeVisible(): boolean {
    return this.visibleError = !this.visibleError;
  }

  public changeErrorMessage(message: string): string {
    return this.errorMessage = message;
  }
}
