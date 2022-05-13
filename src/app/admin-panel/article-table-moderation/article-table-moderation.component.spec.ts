import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleTableModerationComponent } from './article-table-moderation.component';

describe('ArticleTableModerationComponent', () => {
  let component: ArticleTableModerationComponent;
  let fixture: ComponentFixture<ArticleTableModerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleTableModerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleTableModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
