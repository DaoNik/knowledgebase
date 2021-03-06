import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IArticle } from '../interfaces/article';
import { ArticleService } from './article.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleComponent implements OnInit, OnDestroy {
  article$!: Observable<IArticle>;
  subscriptionParams$!: Subscription;
  articleId!: number;

  constructor(
    private articlesServ: ArticleService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.subscriptionParams$ = this.route.params.subscribe((params: Params) => {
      this.article$ = this.articlesServ.getArticle(params['id']);
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy() {
    this.subscriptionParams$.unsubscribe();
  }

  sanitizeHtml(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
