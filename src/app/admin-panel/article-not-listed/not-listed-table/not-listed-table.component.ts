import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { mergeMap, Observable } from 'rxjs';
import { IArticle } from 'src/app/interfaces/article';
import { AdminPanelService } from '../../admin-panel.service';

@Component({
  selector: 'app-not-listed-table',
  templateUrl: './not-listed-table.component.html',
  styleUrls: ['./not-listed-table.component.scss'],
})
export class NotListedTableComponent implements OnInit {
  articles: IArticle[] = [];
  article$!: Observable<IArticle[]>;
  articlesOnPage: number = 3;
  pages: number[] = [];
  category: string = ""

  currentArticles: IArticle[] = this.articles;
  currentPageArticles: IArticle[] = this.currentArticles.slice(0, this.articlesOnPage);
  currentPage: number = 1;

  checkedArticles: string[] = [];
  filterTags: string[] = [];

  search: FormControl = new FormControl('');
  tagInput: FormControl = new FormControl('');

  constructor(
    private router: Router,
    private adminPanelService: AdminPanelService
  ) {}

  ngOnInit(): void {
    this.adminPanelService.categoryNotListed.pipe(
      mergeMap(topic => this.adminPanelService.getArticles(topic))
    ).subscribe((articles) => {
      this.articles = articles;
      this.currentPageArticles = this.articles.slice(0, this.articlesOnPage);
      this.countPages();
    })

    // this.adminPanelService.categoryNotListed.subscribe((topic) => {
    //   this.category = topic;
    // });

    // this.adminPanelService.getArticles(this.category).subscribe((articles) => {
    //   this.articles = articles;
    //   this.currentPageArticles = this.articles.slice(0, this.articlesOnPage);
    //   this.countPages();
    // });
  }

  countPages(): void {
    this.pages = [];
    for (let i = 0; i < this.articles.length / this.articlesOnPage; i++) {
      this.pages.push(i + 1);
    }
  }

  pageClick(page: number): void {
    this.currentPage = page;
    const startArticle: number = (page - 1) * this.articlesOnPage;
    this.currentPageArticles = this.articles.slice(
      startArticle,
      startArticle + this.articlesOnPage
    );
  }

  deleteArticle(articleId: string) {
    this.articles.splice(
      this.articles.findIndex((article) => article._id === articleId),
      1
    );
    this.pageClick(this.currentPage);
    this.countPages();
    this.adminPanelService.deleteArticle(articleId).subscribe();
  }

  deleteSelected(articlesId: string[]): void {
    // articlesId.forEach((id) => this.articles.filter((el) => el.id === id))
    this.articles.filter((article) => !articlesId.includes(article._id!));
    // Здесь запрос на удаление выбранных элементов
  }

  checkArticle(articleId: string): void {
    if (!this.checkedArticles.includes(articleId)) {
      this.checkedArticles.push(articleId);
    } else {
      this.checkedArticles.splice(this.checkedArticles.indexOf(articleId), 1);
    }
  }

  sortByAlphabet(prev: IArticle, next: IArticle): number {
    return prev.title < next.title ? -1 : prev.title > next.title ? 1 : 0;
  }

  sortByID(prev: IArticle, next: IArticle): number {
    return prev._id! < next._id! ? -1 : prev._id! > next._id! ? 1 : 0;
  }

  sortByTeamlead(prev: IArticle, next: IArticle): number {
    return prev.authors[0] < next.authors[0]
      ? -1
      : prev.authors[0] > next.authors[0]
      ? 1
      : 0;
  }

  sortByTags(prev: IArticle, next: IArticle): number {
    if (prev.tags[0] < next.tags[0]) {
      return -1;
    }
    if (prev.tags[0] > next.tags[0]) {
      return 1;
    }
    return 0;
  }

  sortByFlag(flag: string): void {
    switch (flag) {
      case 'id':
        this.articles = this.articles.sort(this.sortByID);
        break;
      case 'title':
        this.articles = this.articles.sort(this.sortByAlphabet);
        break;
      case 'tags':
        this.articles = this.articles.sort(this.sortByTags);
        break;
      case 'authors':
        this.articles = this.articles.sort(this.sortByTeamlead);
        break;
    }
    this.pageClick(this.currentPage);
  }

  // 
  resetPage(): void {
    this.currentPage = 1;
    this.pageClick(this.currentPage);
    this.countPages();
  }

  filterByTag(tag: string) {
    let tagInputValue = this.tagInput.value.trim();
    if (!this.filterTags.includes(tag)) {
      tagInputValue === '' ? this.tagInput.setValue(tag) : this.tagInput.setValue(this.tagInput.value + ', ' + tag);
      this.filterTags.push(tag);

      let temp: IArticle[] = [];
      this.currentArticles.forEach(el => {
        if (el.tags.includes(tag)) {
          temp.push(el);
        }
      });
      this.currentArticles = temp;
    }
    else {
      tagInputValue = tagInputValue.split(', ').splice(tagInputValue.indexOf(tag), tag.length).join(', ');
      this.tagInput.setValue(tagInputValue);
      this.filterTags.splice(this.filterTags.indexOf(tag), 1);
      this.currentArticles = this.articles;

    }
    this.resetPage();
  }

  filterByTeamlead(teamlead: string) {
    if (!this.filterTags.includes(teamlead)) {
      this.filterTags.push(teamlead);
      let temp: IArticle[] = [];
      this.currentArticles.forEach(el => {
        if (el.authors.includes(teamlead)) {
          temp.push(el);
        }
      });
      this.currentArticles = temp;
    }
    else {
      this.filterTags.splice(this.filterTags.indexOf(teamlead), 1);
      let filters: string[] = this.filterTags;
      this.filterTags = []
      this.currentArticles = this.articles;
      filters.forEach(tag => {
        this.filterByTeamlead(tag);
      });
    }
    this.resetPage();
  }
}



