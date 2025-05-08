import { TestBed } from '@angular/core/testing';

import { PartidasMomService } from './partidas-mom.service';

describe('PartidasMomService', () => {
  let service: PartidasMomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartidasMomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
