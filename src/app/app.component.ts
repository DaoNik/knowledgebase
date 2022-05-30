import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'База знаний WB';
  socket = io('http://localhost:3000', {
    path: '/api/socket',
  });

  ngOnInit(): void {
    this.socket.emit(
      'createComment',
      { text: '12345', author: 'Author', taskId: 1 },
      (data: any) => console.log(data)
    );
  }
}
