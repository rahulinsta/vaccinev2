import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainserviceComponent } from './mainservice.component';

describe('MainserviceComponent', () => {
  let component: MainserviceComponent;
  let fixture: ComponentFixture<MainserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainserviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
