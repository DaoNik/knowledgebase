import { ActivatedRoute } from '@angular/router';
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
import { map, Observable, startWith, Subject } from 'rxjs';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss'],
})
export class CreateArticleComponent implements OnInit, OnDestroy {
  @ViewChild('respondentsInput')
  respondentsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tagsInput')
  tagsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('authorsInput')
  authorsInput!: ElementRef<HTMLInputElement>;

  public isEditArticle!: boolean;
  public form!: FormGroup;
  public authors = ['Энни', 'Baboolean'];
  public respondents = ['Качок', 'Dedoolean'];
  public categories = ['JS', 'TS', 'Go'];
  public tags = ['Длинная', 'Короткая'];
  public respondentsCtrl = new FormControl('', Validators.required);
  public tagsCtrl = new FormControl('', Validators.required);
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
    minWidth: '300px',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Введите текст статьи',
    defaultFontName: 'Arial',
    defaultFontSize: '3',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['fontName', 'toggleEditorMode']],
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getUrl();
    this.createForm();
    this.filterChips();
  }

  ngOnDestroy(): void {
    this.ctrl$.unsubscribe();
  }

  getUrl(): void {
    this.route.url.subscribe(
      (url) => (this.isEditArticle = url[0].path === 'edit')
    );
  }

  createForm(): void {
    let title = this.isEditArticle ? 'Title' : '';
    let description = this.isEditArticle ? 'Description' : '';
    let content = this.isEditArticle ? '<h1>Hello</h1>' : '';
    let respondents = this.isEditArticle ? ['Качок'] : [];
    let category = this.isEditArticle ? 'JS' : '';
    let tags = this.isEditArticle ? ['Длинная', 'Короткая'] : [];
    let authors = this.isEditArticle ? ['Энни'] : [];

    this.form = new FormGroup({
      title: new FormControl(title, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40),
        this.manySpacesValidator,
      ]),
      description: new FormControl(description, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100),
        this.manySpacesValidator,
      ]),
      content: new FormControl(content, [
        Validators.required,
        Validators.minLength(4),
        this.manySpacesValidator,
      ]),
      authors: new FormControl(authors, [
        Validators.required,
        Validators.minLength(1),
      ]),
      respondents: new FormControl(respondents, [
        Validators.required,
        Validators.minLength(1),
      ]),
      category: new FormControl(category, [
        Validators.required,
        Validators.minLength(1),
      ]),
      tags: new FormControl(tags, [
        Validators.required,
        Validators.minLength(1),
      ]),
    });

    if (this.isEditArticle) {
      authors.forEach((editAuthor) => {
        this.authors = this.authors.filter((author) => author !== editAuthor);
      });

      respondents.forEach((editRespondent) => {
        this.respondents = this.authors.filter(
          (respondent) => respondent !== editRespondent
        );
      });

      tags.forEach((editTag) => {
        this.tags = this.tags.filter((tag) => tag !== editTag);
      });
    }
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
        chipsCtrl = this.form.get('category') as FormControl;
        chips = this.categories;
      } else {
        chipsCtrl = this.respondentsCtrl;
        chips = this.respondents;
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
      alert(
        JSON.stringify(
          {
            title: this.form.get('title')?.value.trim(),
            description: this.form.get('description')?.value.trim(),
            content: this.form.get('content')?.value.trim(),
            authors: this.form.get('authors')?.value,
            category: this.form.get('category')?.value,
            respondents: this.form.get('respondents')?.value,
            tags: this.form.get('tags')?.value,
          },
          null,
          ' '
        )
      );
    }
  }

  removeChip(chip: string, ctrl: string): void {
    const control = this.form.get(`${ctrl}`);
    let chips =
      ctrl === 'respondents'
        ? this.respondents
        : ctrl === 'tags'
        ? this.tags
        : this.authors;

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
    const control = this.form.get(`${ctrl}`);
    let chips =
      ctrl === 'respondents'
        ? this.respondents
        : ctrl === 'tags'
        ? this.tags
        : this.authors;

    chips.splice(chips.indexOf(event.option.viewValue), 1);
    control?.patchValue([...control?.value, event.option.viewValue]);

    chipInput.value = '';
    chipCtrl.setValue(null);
  }
}
