import { BrowserCacheLocation, Configuration, LogLevel } from '@azure/msal-browser';
import { environment } from '../environments/environment';

export const msalConfig: Configuration = {
    auth: {
      clientId: environment.msalConfig.clientId,
      authority: `${environment.microsoftLoginUrl}${environment.msalConfig.tenantId}`,
      redirectUri: '/',
      postLogoutRedirectUri: '/',
      navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage,
    },
    system: {
      allowPlatformBroker: false,
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Warning,
        piiLoggingEnabled: false,
      },
    },
};

function loggerCallback(logLevel: LogLevel, message: string) {
  switch (logLevel) {
    case LogLevel.Error:
      console.error(message);
      break;
    case LogLevel.Warning:
      console.warn(message);
      break;
    case LogLevel.Info:
      console.info(message);
      break;
    default:
      console.debug(message);
      break;
  }
}
