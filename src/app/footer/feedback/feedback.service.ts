import { IFeedback } from 'src/app/interfaces/feedback';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorModalService } from 'src/app/error-modal/error-modal.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(
    private http: HttpClient,
    private errorService: ErrorModalService,
    @Inject('API_URL') private apiUrl: string
  ) {}

  sendFeedback(feedback: IFeedback): Observable<object> {
    return this.http.post(`${this.apiUrl}/docker/feedback`, feedback).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.visibleForError(
          error.error.message[error.error.message.length - 1]
        );
        return throwError(() => error);
      })
    );
  }
}
