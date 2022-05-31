import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TasksManagerService } from '../tasks-manager.service';
import { ITask } from '../interfaces/taskList.interface';
import { MatDialog } from '@angular/material/dialog';
import { ModalFormComponent } from './modal-form/modal-form.component';

@Component({
  selector: 'app-form-issue',
  templateUrl: './form-issue.component.html',
  styleUrls: ['./form-issue.component.scss'],
})
export class FormIssueComponent {
  allTags: string[] = ['Frontend', 'Backend', 'Склад', 'Базы данных'];
  issueForm!: FormGroup;
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];

  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder, private taskServ: TasksManagerService, public dialog: MatDialog) {
    this.issueForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100),
        ],
      ],
      name: ['', [Validators.required]],
      department: ['', [Validators.required]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
      tags: ['', [Validators.required, Validators.minLength(1)]],
      category: ['', [Validators.required, Validators.minLength(1)]],
    });
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.allTags.slice()
      )
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalFormComponent, {
      panelClass: 'modal-form-global',
      maxWidth: '500px',
      width: '90%'
    });
    
    dialogRef.afterClosed().subscribe(() => {
      // this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  onSubmit() {
    this.issueForm.reset();
    this.tags = [];
  }

  createTask() {
    const formData: any = {
      author: this.issueForm.value.name,
      title: this.issueForm.value.title,
      description: this.issueForm.value.description,
      columnId: 1,
      priority: 'Medium',
      status: 'To Do',
      departments: [this.issueForm.value.department],
      tags: [],
      boardId: 1,
    };
    this.taskServ
      .createTask(
        formData.columnId,
        formData.title,
        formData.boardId,
        formData.author,
        formData.priority,
        formData.status,
        formData.description,
        [formData.author],
        formData.departments,
        formData.tags
      )
      .subscribe();
  }

  remove(fruit: string): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected($event: MatAutocompleteSelectedEvent): void {
    this.tags.push($event.option.viewValue);
    this.issueForm.get('tags')?.setValue(this.tags);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }
}
