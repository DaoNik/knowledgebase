import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigneeModalComponent } from './assignee-modal.component';

describe('AssigneeModalComponent', () => {
  let component: AssigneeModalComponent;
  let fixture: ComponentFixture<AssigneeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssigneeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigneeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
