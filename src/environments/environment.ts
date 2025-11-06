export const environment = {
  production: true,
  msalConfig: {
    clientId: 'ENTER_CLIENT_ID',
    tenantId: 'ENTER_TENANT_ID',
  },
  apiKey: '',
  usePopupAuthentication: false, // Set to true if you want to use popup authentication instead of redirect
  microsoftLoginUrl: 'https://login.microsoftonline.com/',
  microsoftGraphApiBaseUrl: 'https://graph.microsoft.com/v1.0/',
};
