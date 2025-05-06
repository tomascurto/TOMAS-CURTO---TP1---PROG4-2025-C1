import { TestBed } from '@angular/core/testing';

import { RaeService } from './rae.service';

describe('RaeService', () => {
  let service: RaeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
