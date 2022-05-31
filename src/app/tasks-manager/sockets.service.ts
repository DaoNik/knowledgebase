import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { IComment } from './interfaces/comment';

@Injectable({
  providedIn: 'root',
})
export class SocketsService {
  socket = io('https://wbbase.site', {
    path: '/api/socket',
  });

  constructor() {}

  createTaskComment(comment: IComment) {
    this.socket.emit('createComment', comment);
  }

  getTaskComment(): Observable<IComment> {
    return new Observable((sub) => {
      this.socket.on('returnComment', (comment: IComment) => {
        sub.next(comment);
      });
    });
  }

  offTaskComments() {
    this.socket.off('returnComment');
  }
}
