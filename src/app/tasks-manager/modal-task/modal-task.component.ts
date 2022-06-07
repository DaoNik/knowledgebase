import { SocketsService } from './../sockets.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ITypeOption } from './modal-task-interface';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription, catchError, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { TasksManagerService } from '../tasks-manager.service';
import { AssigneeModalComponent } from './assignee-modal/assignee-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteTaskModalComponent } from './delete-task-modal/delete-task-modal.component';
import { IComment } from '../interfaces/comment';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ModalTaskComponent implements OnInit, OnDestroy {
  comments!: IComment[];
  recievedData: any;
  taskData = this.fb.group({
    title: ['Title', Validators.minLength(4)],
    id: this.data,
    status: [],
    column: [],
    columnId: [],
    boardId: [],
    priority: [],
    assignee: [[]],
    contact: [],
    text: [[]],
    comments: [[]],
    dateCreated: [],
    dateUpdated: [],
  });
  commentForm = this.fb.group({
    text: ['', [Validators.minLength(1), Validators.maxLength(500), Validators.required]],
    author: ['Гость', [Validators.minLength(1), Validators.maxLength(50), Validators.required]]
  })
  columns: any = []
  statusVariants: string[] = ['None', 'Todo', 'In progress', 'Done'];
  priorityVariants: string[] = ['None', 'Low', 'Medium', 'High'];
  tabsOptions: string[] = []
  tabsIcon = false;
  typeOptions: ITypeOption[] = [
    {
      name: 'text',
      type: '',
      value: '',
    },
    {
      name: 'ToDo',
      type: 'todo',
      value: 'false',
    },
    {
      name: 'List',
      type: 'ul',
      value: '',
    },
  ];
  inputTrigger = false;
  headerTrigger = false;
  sidebarEditTrigger = false;
  titleOutlineRed = false;
  createOption: ITypeOption = {
    name: 'text',
    type: '',
    value: '',
  };
  inputFile: string = '';
  fileUploaded = false;
  taskLoaded = false;

  subscriptionTask$!: Subscription;
  subscriptionColumn$!: Subscription;

  
  @ViewChild('textareaId', {static: false}) titleArea!: ElementRef;
  @ViewChild('dataArea', {static: false}) dataArea!: ElementRef;
  @ViewChild('tabsGroup', {static: false}) tabsGroup!: MatTabGroup;
  @ViewChild('commentList', {static: false}) commentArea!: ElementRef; 
  @ViewChild('descriptionArea', {static: false}) descriptionArea!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ModalTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private taskManagerService: TasksManagerService,
    private _snackBar: MatSnackBar,
    private socketsService: SocketsService,
    private changeDetector: ChangeDetectorRef
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  addText(e: any, index?: number) {
    if (!index) {
      if (!this.taskData.value.text) {
        this.taskData.value.text = [
          {
            text: e.target.value,
            type: this.createOption.type,
            value: this.createOption.value,
          },
        ];
      } else {
        this.taskData.value.text.push({
          text: e.target.value,
          type: this.createOption.type,
          value: this.createOption.value,
        });
      }
    } else {
      this.taskData.value.text[index].text = e.target.value;
    }
    e.target.value = '';
    this.createOption.type = '';
    this.createOption.value = '';
    this.inputTrigger = false;
    this.updateTaskData();
  }

  changeStatus(status: string) {
    this.taskData.value.status = status;
    this.updateTaskData();
  }

  changeColumn(column: any) {
    this.taskData.value.column = column.title;
    this.taskData.value.columnId = column.id;
    this.updateTaskData();
  }

  changeTitle(e: Event) {
    e.preventDefault();
    if (this.taskData.value.title.trim().length > 3) {
      this.headerTrigger = !this.headerTrigger;
      this.taskData.patchValue({
        title: this.taskData.value.title.replace(/\n/g, "")
      })
      this.updateTaskData();
      this.configureModalHeight();
    } else {
      this.titleOutlineRed = true;
    }
  }

  changeType(option: any, i: number) {
    if (i >= 0) {
      this.taskData.value.text[i].type = option.type;
      this.taskData.value.text[i].value = option.value;
    } else {
      this.createOption.type = option.type;
      this.createOption.value = option.value;
    }
    this.updateTaskData();
  }

  urlCopy() {
    navigator.clipboard.writeText(window.location.href);
    this._snackBar.open('Ссылка скопирована!');
    setTimeout(() => {
      this._snackBar.dismiss();
    }, 1000);
  }

  sidebarSaveReminder() {
    this._snackBar.open('Не забудьте сохраниться!');
    setTimeout(() => {
      this._snackBar.dismiss();
    }, 1000);
  }

  deleteString(i: number) {
    this.taskData.value.text.splice(i, 1);
    this.updateTaskData();
  }

  removeAssignee(index: number): void {
    this.taskData.value.assignee.splice(index, 1);
    this.updateTaskData();
  }

  configureModalHeight(newline?: boolean) {
    this.changeDetector.detectChanges();
    this.titleArea.nativeElement.blur();

    const titleHeight = this.titleArea.nativeElement.scrollHeight;

    
    this.titleArea.nativeElement.style.height = (titleHeight == 55 ? 32 : titleHeight) + "px";
    if (window.innerWidth > 600) {
      this.dataArea.nativeElement.style.height = (titleHeight == 32 ? 353 : 379 - titleHeight) + "px";
      this.tabsGroup._elementRef.nativeElement.style.height = (titleHeight == 32 ? 291 : 317 - titleHeight) + "px";
      this.commentArea.nativeElement.style.height = (titleHeight == 32 ? 190 : 216 - titleHeight) + "px";
      this.descriptionArea.nativeElement.style.height = (titleHeight == 32 ? 230 : 256 - titleHeight) + "px";
    }
  }

  editSidebar() {
    if (this.sidebarEditTrigger == true) this.updateTaskData();
    this.sidebarEditTrigger = !this.sidebarEditTrigger;
  }

  showAndEditAssignee(edit: boolean) {
    const data = [
      {
        edit: edit,
        taskId: this.taskData.value.id,
        taskAssignee: this.taskData.value.assignee,
      },
    ];

    const dialogRef = this.dialog.open(AssigneeModalComponent, {
      panelClass: 'edit-assignee-global',
      data: data,
    });

    dialogRef.afterClosed().subscribe(() => {
      if (this.sidebarEditTrigger) this.sidebarSaveReminder()
      this.uploadTaskData();
      this.changeDetector.markForCheck();
    });
  }

  fileInputChange(input: any) {
    if (!!input.files[0]) {
      this.inputFile = input.files[0].name;
      this.fileUploaded = true;
      setTimeout(() => {
        this.fileUploaded = false;
      }, 1000);
    }
  }

  sendComment() {
    this.socketsService.createTaskComment({
      text: this.commentForm.value.text,
      author: this.commentForm.value.author,
      taskId: this.taskData.value.id,
    });

    this.commentForm.controls['text'].reset();
    setTimeout(() => {
      document.getElementById('commentList')?.scrollTo({
        top: 10000,
        behavior: 'smooth',
      });
    }, 50);
  }

  ngOnInit(): void {
    // console.log(this.titleArea)
    this.uploadTaskData();
    this.getTaskComments();
    this.getTaskComment();
    this.configureTabs();
  }

  configureTabs() {
    if ((window.innerWidth > 600 && window.innerWidth < 720) || window.innerWidth < 400) {
      this.tabsOptions = ['description', 'forum', 'attachment'];
      this.tabsIcon = true;
    } else {
      this.tabsOptions = ['Описание', 'Комментарии', 'Приложения'];
      this.tabsIcon = false;
    }
  }

  getTaskComments() {
    this.taskManagerService
      .getTaskComments(this.taskData.value.id)
      .subscribe((comments) => {
        this.comments = comments;
        this.changeDetector.markForCheck();
      });
  }

  getTaskComment() {
    this.socketsService.getTaskComment().subscribe((comment) => {
      if (+this.taskData.value.id === +comment.taskId) {
        this.comments.push(comment);
      }
      this.changeDetector.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.subscriptionTask$.unsubscribe();
    this.subscriptionColumn$.unsubscribe();
    this.socketsService.offTaskComments();
  }

  updateTaskData() {
    const updatedData = {
      title: this.taskData.value.title,
      status:
        this.taskData.value.status == '' ? 'None' : this.taskData.value.status,
      column: this.taskData.value.column,
      columnId: this.taskData.value.columnId,
      authors: this.taskData.value.assignee,
      priority:
        this.taskData.value.priority == ''
          ? 'None'
          : this.taskData.value.priority,
      contact: this.taskData.value.contact,
      // comments: this.taskData.value.comments,
      description: this.taskData.value.text.map((element: any) =>
        JSON.stringify(element)
      ),
    };
    this.taskManagerService
      .editTask(Number(this.data), updatedData)
      .subscribe((res) => {
        this.taskData.patchValue({
          title: res.title,
          assignee: res.authors,
          status: res.status,
          columnId: res.columnId,
          priority: res.priority,
          contact: res.contact,
          // comments: res.comments,
          dateCreated: this._dateTransform(res.createdAt),
          dateUpdated: this._dateTransform(res.updatedAt),
        });
        this.changeDetector.markForCheck();
      });
  }

  uploadTaskData() {
    const url = this.router.url.split('/');
    this.subscriptionTask$ = this.taskManagerService
      .getTask(Number(url[url.length - 1]))
      .pipe(
        catchError((err) => {
          this.onNoClick();
          this._snackBar.open('Такой задачи не существует!', 'OK');
          setTimeout(() => {
            this._snackBar.dismiss();
          }, 3000);
          throw 'Error while getting task';
        })
      )
      .subscribe((res: any) => {
        this.taskData.patchValue({
          title: res.title,
          assignee: res.authors,
          status: res.status,
          boardId: res.boardId,
          columnId: res.columnId,
          priority: res.priority,
          contact: res.contact,
          dateCreated: this._dateTransform(res.createdAt),
          dateUpdated: this._dateTransform(res.updatedAt),
        });
        
        this.taskLoaded = true;
        this.configureModalHeight();

        if (res.description.length > 0) {
          this.taskData.patchValue({
            text: res.description.map((element: any) => JSON.parse(element)),
          });
        }
        this.changeDetector.markForCheck();
      });

    this.subscriptionColumn$ = this.taskManagerService
      .getColumns()
      .pipe(
        catchError((err) => {
          throw "Column doesn't exist";
        })
      )
      .subscribe((columns) => {
        this.columns = columns;
        columns.map((column: any) => {
          if (column.id == this.taskData.value.columnId) {
            this.taskData.patchValue({
              column: column.title,
            });
          }
        });
        this.changeDetector.markForCheck();
      });
  }

  private _dateTransform(date: string): string {
    return `${date.slice(0, 10)} ${date.slice(11, 19)}`;
  }

  deleteTask() {
    const dialogDel = this.dialog.open(DeleteTaskModalComponent, {
      panelClass: 'delete-modal-global',
      data: this.taskData.value.id,
    });

    dialogDel.afterClosed().subscribe((res) => {
      if (res) this.dialogRef.close(true);
    });
  }
}
