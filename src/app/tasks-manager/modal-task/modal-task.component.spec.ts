import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTaskComponent } from './modal-task.component';

describe('ModalTaskComponent', () => {
  let component: ModalTaskComponent;
  let fixture: ComponentFixture<ModalTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
