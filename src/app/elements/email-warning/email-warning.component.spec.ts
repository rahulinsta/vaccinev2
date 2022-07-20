import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailWarningComponent } from './email-warning.component';

describe('EmailWarningComponent', () => {
  let component: EmailWarningComponent;
  let fixture: ComponentFixture<EmailWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailWarningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
