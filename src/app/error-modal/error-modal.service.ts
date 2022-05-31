import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorModalService {

  constructor() {}

  public visibleError: boolean = false;
  public errorMessage: string = '';

  public offVisible(): boolean {
    return this.visibleError = false;
  }

  public onVisible(): boolean {
    return this.visibleError = true;
  }

  public changeErrorMessage(message: string): string {
    return this.errorMessage = message;
  }
}
