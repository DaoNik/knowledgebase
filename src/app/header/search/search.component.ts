import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, map, Observable, startWith, Subscription } from 'rxjs';
import { IArticle } from 'src/app/interfaces/article';
import { SearchService } from './search.service';

interface IFilter {
  title: string;
  status: boolean;
}
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input('bgColor') bgColor!: boolean;
  searchQuery = new FormControl();
  results: string[] = ['One', 'Two', 'Three'];
  filterOptions: IFilter[] = [
    {
      title: 'Логистика',
      status: true,
    },
    {
      title: 'Серверная сторона',
      status: true,
    },
    {
      title: 'Базы данных',
      status: true,
    },
    {
      title: 'Клиентская сторона',
      status: true,
    },
    {
      title: 'Склад',
      status: true,
    },
    {
      title: 'Пункты выдачи',
      status: true,
    },
    {
      title: 'JS',
      status: true,
    },
  ];
  filteredResults!: Observable<IArticle[]>;
  subscriptionArticles$!: Subscription;
  foundArticles!: IArticle[];

  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit(): void {
    this.filteredResults = this.searchQuery.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.subscriptionArticles$ = this.searchService
      .getArticles()
      .subscribe((articles: IArticle[]) => (this.foundArticles = articles));
  }

  ngOnDestroy() {
    this.subscriptionArticles$.unsubscribe();
  }

  private _filter(value: string): IArticle[] {
    const filterValue = value.toLowerCase();
    const filterTags = this.filterOptions
      .filter((item) => {
        return item.status;
      })
      .map((item) => {
        return item.title;
      });

    return this.foundArticles
      ? this.foundArticles.filter(
          (result) =>
            (result.title.toLowerCase().includes(filterValue) ||
              result.description.toLowerCase().includes(filterValue)) &&
            filterTags.includes(result.category)
        )
      : this.foundArticles;
  }

  changeStatus(item: any): boolean {
    const filterTags = this.filterOptions
      .filter((item) => {
        return item.status;
      })
      // console.log(filterTags)
    if (filterTags.length > 1) return !item.status
    else return item.status
  }

  search() {
    const filterTags = this.filterOptions
      .filter((item) => {
        return item.status;
      })
      .map((item) => {
        return item.title;
      });
    this.searchService.goToSearchResults(this.searchQuery.value, filterTags);
  }

  goToArticle(id: string) {
    this.router.navigateByUrl(`article/${id}`);
  }
}
