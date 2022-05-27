import { CreateArticleService } from './create-article.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { forkJoin, map, Observable, of, startWith, Subject } from 'rxjs';
import { IArticle } from '../interfaces/article';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss'],
})
export class CreateArticleComponent implements OnInit, OnDestroy {
  @ViewChild('departmentsInput')
  departmentsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tagsInput')
  tagsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('authorsInput')
  authorsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('categoryInput')
  categoryInput!: ElementRef<HTMLInputElement>;

  public formSubmitted = false;
  public formLoaded = false;
  public article$!: Observable<IArticle>;
  public articleId!: string;
  public isEditArticle!: boolean;
  public form!: FormGroup;
  public authors!: string[];
  public departments!: string[];
  public categories!: string[];
  public tags!: string[];
  public departmentsCtrl = new FormControl('', Validators.required);
  public tagsCtrl = new FormControl('', Validators.required);
  public categoryCtrl = new FormControl('', Validators.required);
  public authorsCtrl = new FormControl('', Validators.required);
  public ctrl$ = new Subject<string>();
  public filteredChips$!: Observable<string[]>;
  public chipsLoaded = false;
  public editorConfig: AngularEditorConfig = {
    editable: true,
    outline: false,
    spellcheck: true,
    minHeight: '200px',
    maxHeight: '500px',
    minWidth: '200px',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Введите текст статьи',
    defaultFontName: 'Arial',
    defaultFontSize: '3',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['fontName', 'toggleEditorMode', 'insertVideo']],
  };

  constructor(
    private route: ActivatedRoute,
    private createArticleService: CreateArticleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getArticle();
    this.createForm();
    this.filterChips();
  }

  ngOnDestroy(): void {
    this.ctrl$.unsubscribe();
  }

  getArticle(): void {
    this.route.url.subscribe((url) => {
      this.isEditArticle = url[0].path === 'edit';

      if (this.isEditArticle) {
        this.articleId = this.route.snapshot.params['id'];
        this.article$ = this.createArticleService.getArticle(this.articleId);
      } else {
        this.article$ = of({
          title: '',
          description: '',
          content: '',
          authors: [],
          departments: [],
          category: '',
          tags: [],
        });
      }
    });
  }

  createForm(): void {
    forkJoin([
      this.createArticleService.getAuthors(),
      this.createArticleService.getDepartments(),
      this.createArticleService.getTags(),
      this.createArticleService.getCategories(),
      this.article$,
    ])
      .pipe(
        map((data) => {
          this.authors = data[0];
          this.departments = data[1];
          this.tags = data[2];
          this.categories = data[3];

          return data[4];
        })
      )
      .subscribe((article) => {
        article.authors.forEach((editAuthor) => {
          this.authors = this.authors.filter((author) => author !== editAuthor);
        });

        article.departments.forEach((editRespondent) => {
          this.departments = this.departments.filter(
            (respondent) => respondent !== editRespondent
          );
        });

        article.tags.forEach((editTag) => {
          this.tags = this.tags.filter((tag) => tag !== editTag);
        });

        this.categories = this.categories.filter(
          (editCategory) => editCategory !== article.category
        );

        this.form = new FormGroup({
          title: new FormControl(article.title, [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(100),
            this.manySpacesValidator,
          ]),
          description: new FormControl(article.description, [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(200),
            this.manySpacesValidator,
          ]),
          content: new FormControl(article.content, [
            Validators.required,
            Validators.minLength(10),
            this.manySpacesValidator,
          ]),
          authors: new FormControl(article.authors, [
            Validators.required,
            Validators.minLength(1),
          ]),
          departments: new FormControl(article.departments, [
            Validators.required,
            Validators.minLength(1),
          ]),
          category: new FormControl(
            article.category ? [article.category] : '',
            [
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(1),
            ]
          ),
          tags: new FormControl(article.tags, [
            Validators.required,
            Validators.minLength(1),
          ]),
        });
      });
  }

  filterChips(): void {
    this.ctrl$.subscribe((ctrl) => {
      let chipsCtrl: FormControl;
      let chips: string[];

      if (ctrl === 'tags') {
        chipsCtrl = this.tagsCtrl;
        chips = this.tags;
      } else if (ctrl === 'authors') {
        chipsCtrl = this.authorsCtrl;
        chips = this.authors;
      } else if (ctrl === 'category') {
        chipsCtrl = this.categoryCtrl;
        chips = this.categories;
      } else {
        chipsCtrl = this.departmentsCtrl;
        chips = this.departments;
      }

      this.chipsLoaded = true;

      this.filteredChips$ = chipsCtrl.valueChanges.pipe(
        startWith(null),
        map((inputValue: string | null) =>
          inputValue
            ? chips.filter((value) =>
                value.toLowerCase().includes(inputValue.toLowerCase())
              )
            : chips
        )
      );
    });
  }

  manySpacesValidator(control: FormControl): ValidationErrors | null {
    return control.value && control.value.trim().length < 4
      ? { manySpaces: true }
      : null;
  }

  createArticle(): void {
    if (this.form.valid) {
      this.formSubmitted = true;
      this.formLoaded = true;

      const article: IArticle = {
        title: this.form.get('title')?.value.trim(),
        description: this.form.get('description')?.value.trim(),
        content: this.form.get('content')?.value.trim(),
        authors: this.form.get('authors')?.value,
        category: this.form.get('category')?.value[0],
        departments: this.form.get('departments')?.value,
        tags: this.form.get('tags')?.value,
      };

      this.isEditArticle
        ? this.createArticleService
            .editArticle(this.articleId, article)
            .subscribe((article) =>
              this.router.navigateByUrl(`/article/${article._id}`)
            )
        : this.createArticleService
            .createArticle(article)
            .subscribe((article) =>
              this.router.navigateByUrl(`/article/${article._id}`)
            );
    }
  }

  getCtrl(ctrl: string): string[] {
    if (ctrl === 'departments') {
      return this.departments;
    } else if (ctrl === 'tags') {
      return this.tags;
    } else if (ctrl === 'category') {
      return this.categories;
    } else {
      return this.authors;
    }
  }

  removeChip(chip: string, ctrl: string): void {
    const control = this.form.get(ctrl);
    let chips = this.getCtrl(ctrl);

    chips.push(chip);

    control?.patchValue(
      control?.value.filter((value: string) => value !== chip)
    );
  }

  selectChip(
    event: MatAutocompleteSelectedEvent,
    ctrl: string,
    chipInput: HTMLInputElement,
    chipCtrl: FormControl
  ): void {
    const control = this.form.get(ctrl);
    let chips = this.getCtrl(ctrl);

    chips.splice(chips.indexOf(event.option.viewValue), 1);
    control?.patchValue([...control?.value, event.option.viewValue]);

    chipInput.value = '';
    chipCtrl.setValue(null);
  }

  getError(ctrl: string | FormControl, err: string): boolean {
    if (typeof ctrl === 'string') {
      return this.form.get(ctrl)?.getError(err);
    }

    return ctrl.getError(err);
  }

  isTouched(ctrl: string | FormControl): boolean {
    if (typeof ctrl === 'string') {
      return this.form.get(ctrl)!.touched;
    }

    return ctrl.touched;
  }

  resetForm(): void {
    const category = this.form.get('category')?.value;
    const tags = this.form.get('tags')?.value;
    const departments = this.form.get('departments')?.value;
    const authors = this.form.get('authors')?.value;

    this.categories = [...this.categories, ...category];
    this.tags = [...this.tags, ...tags];
    this.departments = [...this.departments, ...departments];
    this.authors = [...this.authors, ...authors];

    this.categoryCtrl.reset();
    this.tagsCtrl.reset();
    this.departmentsCtrl.reset();
    this.authorsCtrl.reset();

    this.form.reset({
      title: '',
      description: '',
      content: '',
      category: [],
      tags: [],
      departments: [],
      authors: [],
    });
  }
}
