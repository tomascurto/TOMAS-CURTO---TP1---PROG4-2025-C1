import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: { navigate: () => {} } }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('debería crearse', () => {
    expect(guard).toBeTruthy();
  });
});