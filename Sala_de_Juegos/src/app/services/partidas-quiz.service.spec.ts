import { TestBed } from '@angular/core/testing';

import { PartidasQuizService } from './partidas-quiz.service';

describe('PartidasQuizService', () => {
  let service: PartidasQuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartidasQuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
