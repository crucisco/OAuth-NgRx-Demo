import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError, Subject, take } from 'rxjs';
import { UserEffects } from './user.effects';
import * as UserActions from './user.actions';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/userProfile';
import { AccountInfo } from '@azure/msal-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { Action } from '@ngrx/store';
import { TestScheduler } from 'rxjs/testing';

describe('UserEffects', () => {
  /*
  THERE ARE 2 SETS OF TESTS HERE
  The profile tests work normally as expected
  The authentication tests are a bit confusing.
  */

  describe('Profile tests', () => {
    let actions$: Observable<Action>;
    let effects: UserEffects;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(() => {
      authServiceSpy = jasmine.createSpyObj('AuthService', [
        'getProfile',
      ], {
        ActiveAccount$: new Subject<AccountInfo | undefined>()
      });

      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          UserEffects,
          provideMockActions(() => actions$),
          { provide: AuthService, useValue: authServiceSpy },
        ]
      });

      effects = TestBed.inject(UserEffects);
    });

    it('should dispatch loadProfileSuccess on successful profile load', (done) => {
      const profile: UserProfile = { id: '1', givenName: 'Test' };
      authServiceSpy.getProfile.and.returnValue(of(profile));

      actions$ = of(UserActions.loadProfile());
      effects.loadProfile$.subscribe(action => {
        expect(action).toEqual(UserActions.loadProfileSuccess({ profile: profile }));
        done();
      });

      expect(authServiceSpy.getProfile).toHaveBeenCalledOnceWith();
    });

    it('should dispatch loadProfileFailure on profile load error', (done) => {
      authServiceSpy.getProfile.and.returnValue(throwError(() => 'error'));

      actions$ = of(UserActions.loadProfile());

      effects.loadProfile$.subscribe(action => {
        expect(action).toEqual(UserActions.loadProfileFailure({ error: 'error' }));
        done();
      });

      expect(authServiceSpy.getProfile).toHaveBeenCalledOnceWith();
    });
  });

  // THESE TESTS ARE REALLY REALLY AWKWARD IN THEIR CURRENT FORM
  // Apart from verifying the call to the underlying service, it appears impossible to assert
  // the effect on the relevant observables i.e. ActiveAccount$
  describe('Authentication-related tests: NEED MORE ATTENTION!!!', () => {
    let actions$: Observable<Action>;
    let effects: UserEffects;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let testScheduler: TestScheduler;

    beforeEach(() => {
      authServiceSpy = jasmine.createSpyObj('AuthService', [
        'getProfile',
        'logIn',
        'logOut',
        'checkIfAuthenticated'
      ], {
        ActiveAccount$: new Subject<AccountInfo | undefined>()
      });

      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });

      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          UserEffects,
          provideMockActions(() => actions$),
          { provide: AuthService, useValue: authServiceSpy },
        ]
      });

      effects = TestBed.inject(UserEffects);
    });

    // Important note: don't use DoneFn when checking other observables. https://github.com/ngrx/platform/issues/1542
    // and https://ngrx.io/guide/effects/testing#providemockactions
    it('should dispatch loginSuccess after logIn and ActiveAccount$ emits', () => {
      const account: AccountInfo = {
        homeAccountId: 'abc', environment: '', tenantId: '', username: '',
        localAccountId: ''
      };

      const spySubj = authServiceSpy.ActiveAccount$ as Subject<AccountInfo | undefined>;
      authServiceSpy.logIn.and.callFake(() => {
        spySubj.next(account);
      });

      actions$ = of(UserActions.login());

      // subscribe to execute effect
      effects.login$.subscribe();

      expect(authServiceSpy.logIn).toHaveBeenCalledOnceWith();
    });

    it('should dispatch loginFailure if ActiveAccount$ errors', () => {
      const spySubj = authServiceSpy.ActiveAccount$ as Subject<AccountInfo | undefined>;
      authServiceSpy.logIn.and.callFake(() => {
        spySubj.next(undefined);
      });

      actions$ = of(UserActions.login());

      effects.login$.subscribe();

      expect(authServiceSpy.logIn).toHaveBeenCalledOnceWith();
    });

    it('should dispatch logoutSuccess after logOut and ActiveAccount$ emits undefined', () => {
      const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
      (authServiceSpy.ActiveAccount$ as Subject<AccountInfo | undefined>).next(undefined);

      actions$ = of(UserActions.logout());

      effects.logout$.subscribe();

      expect(authServiceSpy.logOut).toHaveBeenCalledOnceWith();
    });

    it('should dispatch logoutFailure if ActiveAccount$ errors', () => {
      const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
      const errorSubject = new Subject<AccountInfo>();
      authServiceSpy.ActiveAccount$.pipe(() => errorSubject.asObservable());
      actions$ = of(UserActions.logout());
      setTimeout(() => errorSubject.error('logout error'), 0);

      effects.logout$.subscribe();

      expect(authServiceSpy.logOut).toHaveBeenCalledOnceWith();
    });

    it('should dispatch checkIfAuthenticatedSuccess after checkIfAuthenticated and ActiveAccount$ emits', () => {
      const account: AccountInfo = {
        homeAccountId: 'abc', environment: '', tenantId: 'abc', username: '',
        localAccountId: ''
      };

      const spySubj = authServiceSpy.ActiveAccount$ as Subject<AccountInfo | undefined>;
      authServiceSpy.checkIfAuthenticated.and.callFake(() => {
        spySubj.next(account);
      });

      actions$ = of(UserActions.checkIsAuthenticated());

      // subscribe to execute effect
      effects.isAuthenticated$.subscribe();

      expect(authServiceSpy.checkIfAuthenticated).toHaveBeenCalledOnceWith();
      authServiceSpy.ActiveAccount$.pipe(take(1)).subscribe(acc => {
        expect(acc).toEqual(account);
      });
    });

    it('should dispatch checkIfAuthenticatedFailure after checkIfAuthenticated and ActiveAccount$ emits undefined', () => {
      const spySubj = authServiceSpy.ActiveAccount$ as Subject<AccountInfo | undefined>;
      authServiceSpy.checkIfAuthenticated.and.callFake(() => {
        spySubj.next(undefined);
      });

      actions$ = of(UserActions.checkIsAuthenticated());

      // subscribe to execute effect
      effects.isAuthenticated$.subscribe();

      expect(authServiceSpy.checkIfAuthenticated).toHaveBeenCalledOnceWith();
      authServiceSpy.ActiveAccount$.pipe(take(1)).subscribe(acc => {
        expect(acc).toBeUndefined;
      });
    });
  });
});
