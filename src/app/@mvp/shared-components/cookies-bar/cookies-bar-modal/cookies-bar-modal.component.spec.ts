import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiesBarModalComponent } from './cookies-bar-modal.component';

describe('CookiesBarModalComponent', () => {
  let component: CookiesBarModalComponent;
  let fixture: ComponentFixture<CookiesBarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookiesBarModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiesBarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
