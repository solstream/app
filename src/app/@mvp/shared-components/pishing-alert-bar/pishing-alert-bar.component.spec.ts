import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PishingAlertBarComponent } from './pishing-alert-bar.component';

describe('PishingAlertBarComponent', () => {
  let component: PishingAlertBarComponent;
  let fixture: ComponentFixture<PishingAlertBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PishingAlertBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PishingAlertBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
