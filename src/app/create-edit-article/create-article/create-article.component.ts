import { CreateArticleService } from 'src/app/create-edit-article/create-article/create-article.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { first, Observable } from 'rxjs';
import { IArticle } from './../../../app/interfaces/article';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateArticleComponent implements OnInit {
  public article$!: Observable<IArticle>;

  constructor(
    private createArticleService: CreateArticleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getArticle();
  }

  getArticle(): void {
    this.article$ = this.createArticleService.getArticle();
  }

  createArticle(article: IArticle): void {
    this.createArticleService
      .createArticle(article)
      .pipe(first())
      .subscribe((article) =>
        this.router.navigateByUrl(`/article/${article.id}`)
      );
  }
}
