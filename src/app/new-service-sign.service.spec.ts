import { TestBed } from '@angular/core/testing';

import { NewServiceSignService } from './new-service-sign.service';

describe('NewServiceSignService', () => {
  let service: NewServiceSignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewServiceSignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
