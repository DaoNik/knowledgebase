import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent {
  @Input('control') control!: FormControl;

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
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['fontName', 'toggleEditorMode', 'insertVideo']],
  };
}
