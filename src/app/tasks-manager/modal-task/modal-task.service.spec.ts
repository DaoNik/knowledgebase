import { TestBed } from '@angular/core/testing';

import { ModalTaskService } from './modal-task.service';

describe('ModalTaskService', () => {
  let service: ModalTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
