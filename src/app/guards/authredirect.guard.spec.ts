import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { AuthRedirectGuard } from './authredirect.guard';
import { AccountInfo } from '@azure/msal-browser';
import { UserFacade } from '../state/user/user.facade';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';

describe('AuthRedirectGuard', () => {
  let guard: AuthRedirectGuard;
  let activeInfo$: BehaviorSubject<AccountInfo | undefined>;
  let userFacade: jasmine.SpyObj<UserFacade>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    jasmine.clock().install();
    activeInfo$ = new BehaviorSubject<AccountInfo | undefined>(undefined);
    userFacade = jasmine.createSpyObj('UserFacade', [], {
      accountInfo$: activeInfo$.asObservable()
    });
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        AuthRedirectGuard,
        { provide: UserFacade, useValue: userFacade },
        { provide: Router, useValue: router }
      ]
    });

    guard = TestBed.inject(AuthRedirectGuard);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('canActivate returns true when authenticated', () => {
    activeInfo$.next({
      homeAccountId: 'user1',
      localAccountId: 'user1',
      environment: 'login.microsoftonline.com',
      tenantId: 'tenant1',
      username: 'user1@example.com'
    });

    expect(guard.canActivate()).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('canActivate returns false when unauthenticated and redirects after timeout', () => {
    expect(guard.canActivate()).toBeFalse();

    jasmine.clock().tick(999);
    expect(router.navigate).not.toHaveBeenCalled();

    jasmine.clock().tick(1);
    expect(router.navigate).toHaveBeenCalledOnceWith(['']);
  });

  it('does not redirect if authenticated before timeout', () => {
    expect(guard.canActivate()).toBeFalse();

    // remain unauthenticated for 999ms
    jasmine.clock().tick(999);

    // authenticate just before timeout
    activeInfo$.next({
      homeAccountId: 'user2',
      localAccountId: 'user2',
      environment: 'login.microsoftonline.com',
      tenantId: 'tenant1',
      username: 'user2@example.com'
    });

    expect(router.navigate).not.toHaveBeenCalled();
    expect(guard.canActivate()).toBeTrue();
  });
});
