import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetOtpComponent } from './get-otp.component';

describe('GetOtpComponent', () => {
  let component: GetOtpComponent;
  let fixture: ComponentFixture<GetOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetOtpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
