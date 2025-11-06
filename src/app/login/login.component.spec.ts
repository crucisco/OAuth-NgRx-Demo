import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserFacade } from '../state/user/user.facade';
import { provideMockStore } from '@ngrx/store/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockUserFacade: jasmine.SpyObj<UserFacade>;

  beforeEach(async () => {
    mockUserFacade = jasmine.createSpyObj('UserFacade', ['checkIsAuthenticated', 'login', 'logout'], {
      accountInfo$: of(undefined) // Default to not authenticated
    });

    ({ fixture, component } = await InitialiseTestBed(mockUserFacade));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login method on button click', async () => {
    // Assumes user is not authenticated initially
    ((component as any).isAuthenticated$ as Observable<boolean>).subscribe(isAuth => {
      expect(isAuth).toBe(false);
    })

    const button = fixture.nativeElement.querySelector('button#login');
    button.click();

    expect(mockUserFacade.login).toHaveBeenCalledTimes(1);
  });

  it('should call logout method on button click', async () => {
    mockUserFacade = jasmine.createSpyObj('UserFacade', ['checkIsAuthenticated', 'login', 'logout'], {
      accountInfo$: of({ idToken: 'Test user token' })
    });

    TestBed.resetTestingModule();
    ({ fixture, component } = await InitialiseTestBed(mockUserFacade));

    ((component as any).isAuthenticated$ as Observable<boolean>).subscribe(isAuth => {
      expect(isAuth).toBe(true);
    })

    const button = fixture.nativeElement.querySelector('button#logout');
    button.click();

    expect(mockUserFacade.logout).toHaveBeenCalledTimes(1);
  });
});

async function InitialiseTestBed(mockUserFacade: jasmine.SpyObj<UserFacade>): Promise<{ fixture: ComponentFixture<LoginComponent>, component: LoginComponent }> {
  await TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      { provide: UserFacade, useValue: mockUserFacade },
      provideHttpClient(),
      provideHttpClientTesting(),
      provideMockStore(),
      { provide: ActivatedRoute, useValue: { snapshot: { data: {} } } },
    ],
    imports: [LoginComponent]
  })
    .compileComponents();

  let fixture = TestBed.createComponent(LoginComponent);
  let component = fixture.componentInstance;
  await fixture.whenStable();
  return { fixture, component };
}

