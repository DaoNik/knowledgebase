import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleNotListedComponent } from './article-not-listed.component';

describe('ArticleNotListedComponent', () => {
  let component: ArticleNotListedComponent;
  let fixture: ComponentFixture<ArticleNotListedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleNotListedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleNotListedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
