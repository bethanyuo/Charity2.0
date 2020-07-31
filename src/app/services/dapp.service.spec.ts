import { TestBed } from '@angular/core/testing';

import { DappService } from './dapp.service';

describe('DappService', () => {
  let service: DappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
