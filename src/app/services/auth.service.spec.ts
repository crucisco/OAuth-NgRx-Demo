import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, InteractionStatus } from '@azure/msal-browser';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { provideZonelessChangeDetection } from '@angular/core';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  describe('AuthService - happy path tests', () => {
    let service: AuthService;
    let msalServiceSpy: jasmine.SpyObj<MsalService>;
    let msalBroadcastServiceSpy: jasmine.SpyObj<MsalBroadcastService>;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    let successAuthResult: AuthenticationResult = {
      accessToken: 'test-token',
      account: {
        homeAccountId: 'test-id',
        name: 'Test User',
        localAccountId: '999',
        environment: 'test-env',
        tenantId: 'test-tenant',
        username: 'test@user.com',
      },
      authority: `${environment.microsoftLoginUrl}test-tenant`,
      uniqueId: 'unique-id',
      tenantId: 'test-tenant',
      scopes: ['user.read'],
      idToken: 'id-token',
      expiresOn: new Date(Date.now() + 3600 * 1000),
      fromCache: false,
      correlationId: 'correlation-id',
      tokenType: 'Bearer',
      state: '',
      idTokenClaims: {
        aud: 'test-audience',
        iss: `${environment.microsoftLoginUrl}/test-tenant/v2.0`,
      }
    };

    let successEventMessage: EventMessage = {
      eventType: 'msal:loginSuccess',
      payload: successAuthResult,
      interactionType: null,
      error: null,
      timestamp: 0
    };

    beforeEach(() => {
      msalServiceSpy = jasmine.createSpyObj('MsalService', [
        'handleRedirectObservable',
        'instance',
        'loginRedirect',
        'logoutRedirect',
        'loginPopup',
        'logoutPopup',
      ]);
      msalBroadcastServiceSpy = jasmine.createSpyObj('MsalBroadcastService', ['msalSubject$', 'inProgress$']);
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

      // Mock MSAL instance methods
      msalServiceSpy.instance = {
        getActiveAccount: jasmine.createSpy('getActiveAccount').and.returnValue(successAuthResult.account),
        getAllAccounts: jasmine.createSpy('getAllAccounts').and.returnValue([successAuthResult.account]),
        setActiveAccount: jasmine.createSpy('setActiveAccount'),
        enableAccountStorageEvents: jasmine.createSpy('enableAccountStorageEvents'),
        acquireTokenSilent: jasmine.createSpy('acquireTokenSilent').and.returnValue(Promise.resolve({ accessToken: 'test-token', account: { name: 'Test User' } })),
        initialize: jasmine.createSpy('initialize').and.returnValue(Promise.resolve()),
      } as any;


      msalServiceSpy.handleRedirectObservable.and.returnValue(of(successAuthResult));
      msalBroadcastServiceSpy.msalSubject$ = of(successEventMessage);
      msalBroadcastServiceSpy.inProgress$ = of(InteractionStatus.Login);

      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          AuthService,
          { provide: MsalService, useValue: msalServiceSpy },
          { provide: MsalBroadcastService, useValue: msalBroadcastServiceSpy },
          { provide: HttpClient, useValue: httpClientSpy },
          { provide: MSAL_GUARD_CONFIG, useValue: {} },
        ]
      });

      service = TestBed.inject(AuthService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should call loginRedirect on logIn() if using redirect authentication', () => {
      (service as any).usePopupAuthentication = false; // Simulate redirect auth

      service.logIn();
      expect(msalServiceSpy.loginRedirect).toHaveBeenCalled();
    });

    it('should call logoutRedirect on logOut() if using redirect authentication', () => {
      (service as any).usePopupAuthentication = false; // Simulate redirect auth
      service.logOut();
      expect(msalServiceSpy.logoutRedirect).toHaveBeenCalled();
    });

    it('should call loginRedirect on logIn() if using popup authentication', () => {
      (service as any).usePopupAuthentication = true; // Simulate popup auth

      service.logIn();
      expect(msalServiceSpy.loginPopup).toHaveBeenCalled();
    });

    it('should call logoutRedirect on logOut() if using popup authentication', () => {
      (service as any).usePopupAuthentication = true; // Simulate popup auth

      service.logOut();
      expect(msalServiceSpy.logoutPopup).toHaveBeenCalled();
    });

    it('should get profile from Microsoft Graph', (done: DoneFn) => {
      httpClientSpy.get.and.returnValue(of({ givenName: 'Test profile' }));
      service.getProfile().subscribe({
        next: (profile) => {
          expect(profile).toEqual({ givenName: 'Test profile' });
          done();
        },
        error: (error) => {
          expect(error).toBeUndefined();
          done.fail;
        }
      });
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.microsoftGraphApiBaseUrl}me`);
    });

    it('should return 404 from Microsoft Graph if not found', (done: DoneFn) => {
      const errResponse = new HttpErrorResponse({
        error: "404 - Not Found",
        status: 404,
        statusText: 'Not Found',
      });
      httpClientSpy.get.and.returnValue(throwError(() => errResponse));

      service.getProfile().subscribe({
        next: (profile) => {
          expect(profile).toBeUndefined();
          done.fail('expected an error, not profile');
        },
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });
      expect(httpClientSpy.get.calls.count()).toBe(1);
    });

    it('should set and get token in sessionStorage', () => {
      const token = { accessToken: 'abc123', account: { name: 'Test User' } };
      service['setToken'](token as any);
      const stored = service['getToken']();
      expect(stored.accessToken).toBe('abc123');
    });

    it('should acquire token silently', async () => {
      await service['acquireTokenWithSilentRequest']();
      expect(msalServiceSpy.instance.acquireTokenSilent).toHaveBeenCalled();
    });
  });
});
