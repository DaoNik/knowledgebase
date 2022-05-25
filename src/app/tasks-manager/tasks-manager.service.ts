import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksManagerService {
  private url: string = 'http://51.250.111.214';

  constructor(private http: HttpClient) { }

  getTasks() {
    return this.http.get(`${this.url}/tasks`)
    .pipe(tap(res => console.log(res)))
  }
}