import { TestBed } from '@angular/core/testing';

import { NetworkDiscoveryService } from './network-discovery.service';

describe('NetworkDiscoveryService', () => {
  let service: NetworkDiscoveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkDiscoveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
