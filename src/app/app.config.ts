import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalModule } from '@azure/msal-angular';
import { InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { msalConfig } from './auth.config';
import { provideStore } from '@ngrx/store';
import { userReducers } from './state/user/user.reducers';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { UserEffects } from './state/user/user.effects';
import { provideEffects } from '@ngrx/effects';

const userScopes = ['user.read'];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard,
    importProvidersFrom(MsalModule.forRoot(MSALInstanceFactory(), MSALGuardConfigFactory(), MSALInterceptorConfigFactory())),
    provideStore({ userState: userReducers }),
    provideEffects([UserEffects]),
  ]
};

function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  return {
    interactionType: environment.usePopupAuthentication ? InteractionType.Popup : InteractionType.Redirect,
    protectedResourceMap: new Map([[`${environment.microsoftGraphApiBaseUrl}me`, userScopes]])
  };
}

function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: environment.usePopupAuthentication ? InteractionType.Popup : InteractionType.Redirect,
    authRequest: { scopes: userScopes, redirectUri: '/' },
    loginFailedRoute: '/login-failed'
  };
}

function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

