import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleModerationComponent } from './role-moderation.component';

describe('RoleModerationComponent', () => {
  let component: RoleModerationComponent;
  let fixture: ComponentFixture<RoleModerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleModerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
