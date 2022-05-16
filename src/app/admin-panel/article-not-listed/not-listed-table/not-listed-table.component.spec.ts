import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotListedTableComponent } from './not-listed-table.component';

describe('NotListedTableComponent', () => {
  let component: NotListedTableComponent;
  let fixture: ComponentFixture<NotListedTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotListedTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotListedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
