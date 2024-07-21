import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorBenefitsComponent } from './creator-benefits.component';

describe('CreatorBenefitsComponent', () => {
  let component: CreatorBenefitsComponent;
  let fixture: ComponentFixture<CreatorBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatorBenefitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
