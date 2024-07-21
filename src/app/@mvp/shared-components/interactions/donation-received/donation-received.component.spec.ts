import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationReceivedComponent } from './donation-received.component';

describe('DonationReceivedComponent', () => {
  let component: DonationReceivedComponent;
  let fixture: ComponentFixture<DonationReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationReceivedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
