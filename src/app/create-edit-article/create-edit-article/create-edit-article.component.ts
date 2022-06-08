import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  first,
  forkJoin,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { IArticle } from 'src/app/interfaces/article';
import { IDepartment } from 'src/app/interfaces/department';
import { CreateEditArticleService } from './create-edit-article.service';

@Component({
  selector: 'app-create-edit-article',
  templateUrl: './create-edit-article.component.html',
  styleUrls: ['./create-edit-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditArticleComponent implements OnInit {
  @Input('article') article$!: Observable<IArticle>;
  @Input('textBtn') textBtn!: string;
  @Output('articleEvent') articleEmitter = new EventEmitter<IArticle>();

  public formSubmitted = false;
  public formLoaded = false;
  public form!: FormGroup;
  public authors!: string[];
  public departments!: IDepartment[];
  public departmentNames!: string[];
  public categories!: string[];
  public tags!: string[];
  public departmentsCtrl = new FormControl('', Validators.required);
  public tagsCtrl = new FormControl('', Validators.required);
  public categoryCtrl = new FormControl('', Validators.required);
  public authorsCtrl = new FormControl('', Validators.required);
  public ctrl$ = new Subject<string>();
  public filteredChips$!: Observable<string[]>;
  public chipsLoaded = false;
  private destroySubscribes$ = new Subject<boolean>();

  constructor(
    private createEditArticleService: CreateEditArticleService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.filterChips();
  }

  createForm(): void {
    forkJoin([
      this.createEditArticleService.getDepartments(),
      this.createEditArticleService.getTags(),
      this.createEditArticleService.getCategories(),
      this.article$,
    ])
      .pipe(
        first(),
        map((data) => {
          this.departments = data[0];
          this.tags = data[1];
          this.categories = data[2];

          return data[3];
        })
      )
      .subscribe((article) => {
        this.tags = this.filterArticleData(article.tags, this.tags);

        this.categories = this.filterArticleData(
          [article.category],
          this.categories
        );

        this.departmentNames = this.filterArticleData(
          article.department,
          this.departments.map((department) => department.name_Department)
        );

        this.authors = this.filterArticleData(article.authors, this.authors);

        article.department.forEach((departmentName) => {
          this.getAuthors(departmentName);
        });

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
          departments: new FormControl(article.department, [
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

        this.changeDetectorRef.markForCheck();
      });
  }

  manySpacesValidator(control: FormControl): ValidationErrors | null {
    return control.value && control.value.trim().length < 4
      ? { manySpaces: true }
      : null;
  }

  filterArticleData(oldData: string[], newData: string[]): string[] {
    const dataSet = new Set(oldData);

    return (newData || []).filter((value) => !dataSet.has(value)).sort();
  }

  filterChips(): void {
    this.ctrl$.pipe(takeUntil(this.destroySubscribes$)).subscribe((ctrl) => {
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
        chips = this.departmentNames;
      }

      this.chipsLoaded = true;

      this.filteredChips$ = chipsCtrl.valueChanges.pipe(
        takeUntil(this.destroySubscribes$),
        startWith(null),
        map((inputValue: string | null) =>
          inputValue
            ? chips.filter((value) =>
                value.toLowerCase().includes(inputValue.toLowerCase())
              )
            : chips
        )
      );
      this.changeDetectorRef.markForCheck();
    });
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

  getChips(ctrl: string): string[] {
    if (ctrl === 'departments') {
      return this.departmentNames;
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
    const chips = this.getChips(ctrl);

    chips.push(chip);
    chips.sort();

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
    const chips = this.getChips(ctrl);

    chips.splice(chips.indexOf(event.option.viewValue), 1);
    control?.patchValue([...control?.value, event.option.viewValue]);

    chipInput.value = '';
    chipCtrl.setValue(null);
  }

  getAuthors(departmentName: string): void {
    const department = this.departments.filter(
      (department) => department.name_Department === departmentName
    )[0];

    this.createEditArticleService
      .getAuthors(department.id)
      .pipe(first())
      .subscribe((authors) => {
        const authorsSet = new Set(this.form.get('authors')?.value);

        if (!this.authors?.length) {
          this.authors = [];
        }

        this.authors = [...this.authors, ...authors].filter(
          (author) => !authorsSet.has(author)
        );

        this.changeDetectorRef.markForCheck();
      });
  }

  removeAuthors(departmentName: string): void {
    const department = this.departments.filter(
      (department) => department.name_Department === departmentName
    )[0];

    this.createEditArticleService
      .getAuthors(department.id)
      .pipe(first())
      .subscribe((authors) => {
        const authorsSet = new Set(authors);
        const control = this.form.get('authors');

        this.authors = this.authors.filter((author) => !authorsSet.has(author));
        control?.patchValue(
          control?.value.filter((author: string) => !authorsSet.has(author))
        );

        this.changeDetectorRef.markForCheck();
      });
  }

  setCategory(newCategory: string): void {
    const control = this.form.get('category');
    const oldCategory = control?.value;

    control?.patchValue([newCategory]);
    this.categories.push(oldCategory[0]);

    this.categories = this.categories
      .filter((category) => category !== newCategory)
      .sort();
  }

  resetForm(): void {
    const category = this.form.get('category')?.value;
    const tags = this.form.get('tags')?.value;
    const departments = this.form.get('departments')?.value;

    this.categories = [...this.categories, ...category].sort();
    this.tags = [...this.tags, ...tags].sort();
    this.departmentNames = [...this.departmentNames, ...departments].sort();
    this.authors = [];

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
        department: this.form.get('departments')?.value,
        tags: this.form.get('tags')?.value,
      };

      this.articleEmitter.emit(article);
    }
  }
}
