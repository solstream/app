import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarnProgressComponent } from './earn-progress.component';

describe('EarnProgressComponent', () => {
  let component: EarnProgressComponent;
  let fixture: ComponentFixture<EarnProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarnProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarnProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
