import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokeralaComponent } from './pokerala.component';
import { CommonModule } from '@angular/common';

describe('PokeralaComponent', () => {
  let component: PokeralaComponent;
  let fixture: ComponentFixture<PokeralaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokeralaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokeralaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
