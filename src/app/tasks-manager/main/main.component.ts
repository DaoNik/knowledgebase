import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ModalTaskService } from '../modal-task/modal-task.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ITasksList } from '../interfaces/taskList.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  todo: ITasksList = {
    name: "To Do",
    tasks: ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep']
  };

  inProgress: ITasksList = {
    name: "In Progress",
    tasks: ['Max goes to toilet', 'Max washes his ass', 'Dimon goes to walk on Naberezhnaya', 'We are kicked Karina into the mute voice channel']
  };

  done: ITasksList = {
    name: "Done",
    tasks: ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog']
  };

  list: ITasksList[] = [this.todo, this.inProgress, this.done];

  public form!: FormGroup;
  public formColumns!: FormGroup;
  isHidden: boolean = false;
  isHiddenColumn: boolean = false;

  constructor(
    private modalServ: ModalTaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = new FormGroup({
      toDoName: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(40)])
    })
    this.formColumns = new FormGroup({
      columnName: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(15)])
    })
  }

  ngOnInit(): void {}

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  openTask(item: any) {
    this.modalServ.openDialog(item)
    this.router.navigate(['tasks-manager/tasks', item]);
  }
  addToDo() {
    this.isHidden = false;
    this.list[0].tasks.unshift(this.form.value.toDoName)
    this.form.reset();
  }

  addColumn() {
    let newColumn: ITasksList = {
      name: this.formColumns.value.columnName,
      tasks: []
    }
    this.list.push(newColumn);
    this.isHiddenColumn = false;
  }
}
