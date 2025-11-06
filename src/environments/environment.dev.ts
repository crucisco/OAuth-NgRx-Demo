export const environment = {
  production: false,
  msalConfig: {
    clientId: 'YOUR CLIENT ID HERE',
    tenantId: 'TENANT ID HERE',
  },
  apiKey: '',
  usePopupAuthentication: false, // Set to true if you want to use popup authentication instead of redirect
  microsoftLoginUrl: 'https://login.microsoftonline.com/',
  microsoftGraphApiBaseUrl: 'https://graph.microsoft.com/v1.0/',
};
