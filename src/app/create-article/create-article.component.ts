import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { map, Observable, startWith, Subject, take, tap } from 'rxjs';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss'],
})
export class CreateArticleComponent implements OnInit {
  @ViewChild('respondentsInput')
  respondentsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tagsInput')
  tagsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('authorsInput')
  authorsInput!: ElementRef<HTMLInputElement>;

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
  public editorConfig: AngularEditorConfig = {
    editable: true,
    outline: false,
    spellcheck: true,
    minHeight: '200px',
    maxHeight: '500px',
    minWidth: '320px',
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

  constructor() {}

  ngOnInit(): void {
    this.createForm();
    this.filterChips();
  }

  createForm(): void {
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40),
        this.manySpacesValidator,
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100),
        this.manySpacesValidator,
      ]),
      content: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(1000),
        this.manySpacesValidator,
      ]),
      authors: new FormControl(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
      respondents: new FormControl(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
      category: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      tags: new FormControl([], [Validators.required, Validators.minLength(1)]),
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
        chipsCtrl = this.form.get('category') as FormControl;
        chips = this.categories;
      } else {
        chipsCtrl = this.respondentsCtrl;
        chips = this.respondents;
      }

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
        JSON.stringify({
          title: this.form.get('title')?.value.trim(),
          description: this.form.get('description')?.value.trim(),
          content: this.form.get('content')?.value.trim(),
          authors: this.form.get('authors')?.value,
          category: this.form.get('category')?.value,
          respondents: this.form.get('respondents')?.value,
          tags: this.form.get('tags')?.value,
        })
      );
    }
  }

  removeChip(chip: string, ctrl: string): void {
    const control = this.form.get(`${ctrl}`);

    control?.patchValue(
      control?.value.filter((value: string) => value !== chip)
    );
  }

  selectChip(event: MatAutocompleteSelectedEvent, ctrl: string): void {
    const control = this.form.get(`${ctrl}`);
    let chipCtrl: FormControl;
    let chipInput: ElementRef<HTMLInputElement>;

    if (ctrl === 'respondents') {
      chipCtrl = this.respondentsCtrl;
      chipInput = this.respondentsInput;
    } else if (ctrl === 'tags') {
      chipCtrl = this.tagsCtrl;
      chipInput = this.tagsInput;
    } else {
      chipCtrl = this.authorsCtrl;
      chipInput = this.authorsInput;
    }

    control?.patchValue([...control?.value, event.option.viewValue]);

    chipInput.nativeElement.value = '';
    chipCtrl.setValue(null);
  }
}
