import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoDisclModalComponent } from './demo-discl-modal.component';

describe('DemoDisclModalComponent', () => {
  let component: DemoDisclModalComponent;
  let fixture: ComponentFixture<DemoDisclModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoDisclModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoDisclModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
