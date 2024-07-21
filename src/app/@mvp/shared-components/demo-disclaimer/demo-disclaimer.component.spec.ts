import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoDisclaimerComponent } from './demo-disclaimer.component';

describe('DemoDisclaimerComponent', () => {
  let component: DemoDisclaimerComponent;
  let fixture: ComponentFixture<DemoDisclaimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoDisclaimerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
