import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input('bgColor') bgColor!: boolean;
  searchQuery = new FormControl('');
  results: string[] = ['One', 'Two', 'Three'];
  filterOptions: IFilter[] = [];
  filteredResults!: Observable<IArticle[]>;
  subscriptionArticles$!: Subscription;
  subscriptionCategories$!: Subscription;
  foundArticles!: IArticle[];

  constructor(
    private searchService: SearchService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptionCategories$ = this.searchService
      .getCategories()
      .subscribe((res: string[]) => {
        res.map((tag: string) => {
          this.filterOptions.push({
            title: tag,
            status: true
          })
        })
        this.changeDetectorRef.markForCheck();
      })
    this.filteredResults = this.searchQuery.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.subscriptionArticles$ = this.searchService
      .getArticles()
      .subscribe((articles: IArticle[]) => {
        this.foundArticles = articles;
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy() {
    this.subscriptionArticles$.unsubscribe();
    this.subscriptionCategories$.unsubscribe();
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

  changeStatus(option: any): boolean {
    const filterTags = this.filterOptions.filter((item) => {
      return item.status;
    });

    if (filterTags.length > 1) return !option.status;
    else return true;
  }

  search() {
    const filterTags = this.filterOptions
      .filter((item) => {
        return item.status;
      })
      .map((item) => {
        return item.title;
      });
      
    this.searchService.goToSearchResults(
      this.searchQuery.value.trim(),
      filterTags
    );
  }

  goToArticle(id: string) {
    this.router.navigateByUrl(`article/${id}`);
  }
}
