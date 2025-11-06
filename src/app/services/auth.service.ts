import { inject, Injectable } from '@angular/core';
import { name as BrowserName, version as BrowserVersion } from '@azure/msal-browser/package.json';
import { name, version } from '@azure/msal-angular/package.json';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult, EventMessage, EventType, InteractionStatus, PopupRequest, RedirectRequest, SilentRequest } from '@azure/msal-browser';
import { BehaviorSubject, filter, Observable, Subject, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from '../models/userProfile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _destroying$ = new Subject<void>();
  private readonly msalGuardConfig: MsalGuardConfiguration = inject<MsalGuardConfiguration>(MSAL_GUARD_CONFIG);
  private readonly usePopupAuthentication = environment.usePopupAuthentication;
  private isInitialised: boolean = false;

  private activeAccount = new BehaviorSubject<AccountInfo | undefined>(undefined);

  constructor(private msalService: MsalService, private msalBroadcastService: MsalBroadcastService, private http: HttpClient) {
    // We seem to need this or page refreshes 'forget' that we are already logged in
      this.msalService.handleRedirectObservable().subscribe(result => {
        console.debug('[AUTH SERVICE] handleRedirectObservable: ', result);
      });
  }

  public checkIfAuthenticated(): void {
    if (!this.isInitialised) {
      this.initialise();
    }

    this.validateAuthentication();
  }

  public get ActiveAccount$(): Observable<AccountInfo | undefined> {
    return this.activeAccount.asObservable();
  }

  public logIn() {
    if (!this.isInitialised) {
      this.initialise();
    }

    if (this.usePopupAuthentication) {
      this.logInWithPopup();
    } else {
      this.logInWithRedirect();
    }
  }

  public logOut() {
    if (!this.isInitialised) {
      this.initialise();
    }

    if (this.usePopupAuthentication) {
      const request = { ...this.msalGuardConfig.authRequest, } as PopupRequest;
      this.msalService.logoutPopup(request);
    }
    else {
      const request = { ...this.msalGuardConfig.authRequest, } as RedirectRequest;
      this.msalService.logoutRedirect(request);
    }
  }

  public getProfile(): Observable<UserProfile> {
    if (!this.isInitialised) {
      this.initialise();
    }

    const url = `${environment.microsoftGraphApiBaseUrl}me`;
    return this.http.get(url);
  }

  private initialise(): void {
    console.debug('[AUTH SERVICE] Initialising...');

    // Enable event listener for when a user account is added or removed
    // from localstorage in a different browser tab or window
    this.msalService.instance.enableAccountStorageEvents();

    // Used after first or new login or when opening a new tab (new session)
    this.msalBroadcastService.msalSubject$.pipe(
      filter((msg: EventMessage) =>
        msg.eventType === EventType.LOGIN_SUCCESS ||
        msg.eventType === EventType.ACCOUNT_ADDED ||
        msg.eventType === EventType.ACCOUNT_REMOVED),
      takeUntil(this._destroying$)
    ).subscribe((result: EventMessage) => {
      console.debug(`[AUTH SERVICE] MsalBroadcastService event: ${result.eventType}`);

      if (this.msalService.instance.getAllAccounts().length === 0) {
        console.debug('[AUTH SERVICE] No accounts found after login');
        window.location.pathname = '/';
      } else {
        // LOGIN_SUCCESS
        const payload = result.payload as AuthenticationResult;
        this.msalService.instance.setActiveAccount(payload.account);
        console.debug(`[AUTH SERVICE] Login success: ${payload.account.username}`);
      }
    });

    // called after login
    this.msalBroadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    ).subscribe({
      next: () => {
        this.validateAuthentication();
      },
      complete: () => {
        console.debug('[AUTH SERVICE] MsalBroadcastService: Completed');
      }
    });

    console.debug(`[AUTH SERVICE] Initialized: MSAL ${BrowserName}@v${BrowserVersion}; ${name}@v${version}`);
    this.msalService.instance.initialize().then(() => { this.isInitialised = true; });
  }

  private validateAuthentication() {
    console.debug('[AUTH SERVICE] validateAuthentication: Validate Login');
    this.checkAndSetActiveAccount();
    if (this.activeAccount.getValue()) {
      this.acquireTokenWithSilentRequest();
    }
  }

  private logInWithPopup() {
    if (this.msalGuardConfig.authRequest) {
      const request = { ...this.msalGuardConfig.authRequest, } as PopupRequest;
      this.msalService.loginPopup(request);
      console.debug(`[AUTH SERVICE] Popup login with authRequest: ${request.scopes}`);
    }
    else {
      this.msalService.loginPopup();
      console.debug(`[AUTH SERVICE] Popup login`);
    }
  }

  private logInWithRedirect() {
    if (this.msalGuardConfig.authRequest) {
      const request = { ...this.msalGuardConfig.authRequest, } as RedirectRequest;
      this.msalService.loginRedirect(request);
      console.debug(`[AUTH SERVICE] Redirect login authRequest: ${request.scopes}`);
    }
    else {
      this.msalService.loginRedirect();
      console.debug(`[AUTH SERVICE] Redirect login Otherwise`);
    }
  }

  private acquireTokenWithSilentRequest() {
    const activeAccount: AccountInfo | undefined = this.msalService.instance.getActiveAccount() ?? undefined;
    const silentRequest: SilentRequest = { scopes: [environment.apiKey], account: activeAccount };
    this.msalService.instance.acquireTokenSilent(silentRequest).then((result: AuthenticationResult) => {
      console.debug(`[AUTH SERVICE] acquireTokenWithSilentRequest: ${result.accessToken.substring(0, 10)} for ${activeAccount?.name}`);
      this.setToken(result);
    }).catch((error) => {
      console.debug(`[AUTH SERVICE] acquireTokenWithSilentRequest: Failed ${error}`);
    });
  }

  private checkAndSetActiveAccount() {
    let authenticatedAccount: AccountInfo | null = this.msalService.instance.getActiveAccount();
    if (!authenticatedAccount && this.msalService.instance.getAllAccounts().length > 0) {
      console.debug('[AUTH SERVICE] checkAndSetActiveAccount: Set Active Account');
      let accounts = this.msalService.instance.getAllAccounts();
      this.msalService.instance.setActiveAccount(accounts[0]);
      authenticatedAccount = accounts[0];
    }
    this.activeAccount.next(authenticatedAccount === null ? undefined : authenticatedAccount);
    console.debug(`[AUTH SERVICE] checkAndSetActiveAccount: ${this.activeAccount?.getValue()?.name}`);
  }

  // Set token to sessionStorage
  private setToken = (token: AuthenticationResult) => sessionStorage.setItem('accessToken', JSON.stringify(token));

  // Get token from sessionStorage
  private getToken = () => JSON.parse(sessionStorage.getItem('accessToken') || '{}') as AuthenticationResult;

}

