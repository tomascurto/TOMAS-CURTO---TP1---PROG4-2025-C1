import { TestBed } from '@angular/core/testing';

import { PartidasPokerService } from './partidas-poker.service';

describe('PartidasPokerService', () => {
  let service: PartidasPokerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartidasPokerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
