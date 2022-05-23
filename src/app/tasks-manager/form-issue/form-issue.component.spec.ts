import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIssueComponent } from './form-issue.component';

describe('FormIssueComponent', () => {
  let component: FormIssueComponent;
  let fixture: ComponentFixture<FormIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormIssueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
