import { TestBed } from '@angular/core/testing';

import { ConfirmedDataService } from './confirmed-data.service';

describe('ConfirmedDataService', () => {
  let service: ConfirmedDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmedDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
