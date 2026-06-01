import { TestBed } from '@angular/core/testing';

import { NetworkDetailService } from './network-detail.service';

describe('NetworkDetailService', () => {
  let service: NetworkDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
