import * as UserActions from './user.actions';
import { UserProfile } from '../../models/userProfile';
import { AccountInfo } from '@azure/msal-browser';

describe('UserActions', () => {
  const account: AccountInfo = {
    homeAccountId: 'abc', environment: '', tenantId: '', username: '',
    localAccountId: ''
  };

  it('should create loadProfile action', () => {
    const action = UserActions.loadProfile();
    expect(action.type).toBe('[User] Load Profile');
  });

  it('should create loadProfileSuccess action with payload', () => {
    const profile: UserProfile = { id: '1', givenName: 'Test' };
    const action = UserActions.loadProfileSuccess({ profile });
    expect(action.type).toBe('[User] Load Profile Success');
    expect(action.profile).toEqual(profile);
  });

  it('should create loadProfileFailure action with error', () => {
    const action = UserActions.loadProfileFailure({ error: 'error' });
    expect(action.type).toBe('[User] Load Profile Failure');
    expect(action.error).toBe('error');
  });

  it('should create login action', () => {
    const action = UserActions.login();
    expect(action.type).toBe('[User] Login');
  });

  it('should create loginSuccess action with account', () => {
    const action = UserActions.loginSuccess({ account });
    expect(action.type).toBe('[User] Login Success');
    expect(action.account).toEqual(account);
  });

  it('should create loginFailure action with error', () => {
    const action = UserActions.loginFailure({ error: 'login error' });
    expect(action.type).toBe('[User] Login Failure');
    expect(action.error).toBe('login error');
  });

  it('should create logout action', () => {
    const action = UserActions.logout();
    expect(action.type).toBe('[User] Logout');
  });

  it('should create logoutSuccess action', () => {
    const action = UserActions.logoutSuccess();
    expect(action.type).toBe('[User] Logout Success');
  });

  it('should create logoutFailure action with error', () => {
    const action = UserActions.logoutFailure({ error: 'logout error' });
    expect(action.type).toBe('[User] Logout Failure');
    expect(action.error).toBe('logout error');
  });

  it('should create checkIsAuthenticated action', () => {
    const action = UserActions.checkIsAuthenticated();
    expect(action.type).toBe('[User] Check Is Authenticated');
  });

  it('should create checkIsAuthenticatedSuccess action', () => {
    const action = UserActions.checkIsAuthenticatedSuccess({ account });
    expect(action.type).toBe('[User] Check Is Authenticated Success');
  });

  it('should create checkIsAuthenticatedFailure action with error', () => {
    const action = UserActions.checkIsAuthenticatedFailure({ error: 'checkIsAuthenticated error' });
    expect(action.type).toBe('[User] Check Is Authenticated Failure');
    expect(action.error).toBe('checkIsAuthenticated error');
  });
});
