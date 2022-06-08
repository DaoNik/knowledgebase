import { EditArticleService } from './edit-article.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { first, Observable } from 'rxjs';
import { IArticle } from 'src/app/interfaces/article';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditArticleComponent implements OnInit {
  public article$!: Observable<IArticle>;
  public articleId!: string;

  constructor(
    private editArticleService: EditArticleService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getArticle();
  }

  getArticle(): void {
    this.articleId = this.route.snapshot.params['id'];

    this.article$ = this.editArticleService.getArticle(this.articleId);
  }

  editArticle(article: IArticle): void {
    this.editArticleService
      .editArticle(this.articleId, article)
      .pipe(first())
      .subscribe((article) => {
        this.router.navigateByUrl(`/article/${article.id}`);
        this.changeDetectorRef.markForCheck();
      });
  }
}
