import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFailedComponent } from './login-failed.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('LoginFailedComponent', () => {
  let component: LoginFailedComponent;
  let fixture: ComponentFixture<LoginFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
      ],
      imports: [LoginFailedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
