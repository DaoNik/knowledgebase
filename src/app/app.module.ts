import { NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TasksManagerModule } from './tasks-manager/tasks-manager.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SearchComponent } from './header/search/search.component';
import { CreateArticleComponent } from './create-article/create-article.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { FeedbackComponent } from './footer/feedback/feedback.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ArticleComponent } from './article/article.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { BreadCrumbsComponent } from './bread-crumbs/bread-crumbs.component';

// Для пайпа даты
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClickAwayDirective } from './direct/click-away.directive';
import { ModalTaskEntryComponent } from './tasks-manager/modal-task/modal-task-entry.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';
registerLocaleData(localeRu);

const API_URL_PROVIDER: Provider = {
  provide: 'API_URL',
  useValue: 'https://wbschool-chat.ru/api/articles',
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    SidebarComponent,
    CreateArticleComponent,
    SearchComponent,
    FeedbackComponent,
    ArticleComponent,
    SearchResultsComponent,
    BreadCrumbsComponent,
    NotFoundComponent,
    ClickAwayDirective,
    ModalTaskEntryComponent,
    ErrorModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    AngularEditorModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatCheckboxModule,
    AngularEditorModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    HttpClientModule,
    TasksManagerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  providers: [API_URL_PROVIDER],
  bootstrap: [AppComponent],
})
export class AppModule {}
