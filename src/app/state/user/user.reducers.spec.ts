import * as fromUserReducers from './user.reducers';
import { checkIsAuthenticated, checkIsAuthenticatedFailure, checkIsAuthenticatedSuccess, loadProfile, loadProfileFailure, loadProfileSuccess, login, loginFailure, loginSuccess, logout, logoutFailure, logoutSuccess } from './user.actions';
import { initialState } from './user.state';
import { UserProfile } from '../../models/userProfile';
import { Status } from '../../models/status';
import { AccountInfo } from '@azure/msal-browser';

describe('UserReducers', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = { type: 'Unknown' };
      const state = fromUserReducers.userReducers(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('loadProfile action', () => {
    it('should retrieve loading state', () => {
      const newState = { ...initialState, status: Status.Loading };

      const action = loadProfile();
      const state = fromUserReducers.userReducers(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should retrieve profile and update state', () => {
      const profile: UserProfile = { id: '1', givenName: 'Test User', surname: 'Testerooney', userPrincipalName: 'test@testero.on.y' };
      const newState = { ...initialState, profile: profile, status: Status.Success };

      const action = loadProfileSuccess({ profile });
      const state = fromUserReducers.userReducers(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should retreive error and update state', () => {
      const newState = { ...initialState, status: Status.Error, error: 'Something screwed up!' };

      const action = loadProfileFailure({ error: newState.error });
      const state = fromUserReducers.userReducers(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('login action', () => {
    it('should retrieve loading state', () => {
      const newState = { ...initialState, status: Status.Loading };

      const action = login();
      const state = fromUserReducers.userReducers(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should login and update state', () => {
      const account: AccountInfo = {
        homeAccountId: '234324',
        environment: 'sdf',
        tenantId: '324dsfsed',
        username: '324sffd',
        localAccountId: '32gdfe434'
      };
      const newState = { ...initialState, accountInfo: account, status: Status.Success };

      const action = loginSuccess({ account });
      const state = fromUserReducers.userReducers(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should retreive error and update state', () => {
      const newState = { ...initialState, status: Status.Error, error: 'Something screwed up!' };

      const action = loginFailure({ error: newState.error });
      const state = fromUserReducers.userReducers(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('logout action', () => {
    const profile: UserProfile = { id: '1', givenName: 'Test User', surname: 'Testerooney', userPrincipalName: 'test@testero.on.y' };
    const account: AccountInfo = {
      homeAccountId: '234324',
      environment: 'sdf',
      tenantId: '324dsfsed',
      username: '324sffd',
      localAccountId: '32gdfe434'
    };
    const loggedInState = { ...initialState, accountInfo: account, profile: profile, status: Status.Success };

    it('should retrieve loading state', () => {
      const newState = { ...loggedInState, status: Status.Loading };

      const action = logout();
      const state = fromUserReducers.userReducers(loggedInState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(loggedInState);
    });

    it('should logout and update state', () => {
      const newState = { ...loggedInState, accountInfo: undefined, profile: undefined, status: Status.Success };

      const action = logoutSuccess();
      const state = fromUserReducers.userReducers(loggedInState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(loggedInState);
    });

    it('should retreive error and update state', () => {
      const newState = { ...loggedInState, status: Status.Error, error: 'Something screwed up!' };

      const action = logoutFailure({ error: newState.error });
      const state = fromUserReducers.userReducers(loggedInState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(loggedInState);
    });
  });

    describe('checkIsAuthenticated action', () => {
    it('should retrieve loading state', () => {
      const newState = { ...initialState, status: Status.Loading };

      const action = checkIsAuthenticated();
      const state = fromUserReducers.userReducers(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should checkIsAuthenticated and update state', () => {
      const account: AccountInfo = {
        homeAccountId: '234324',
        environment: 'sdf',
        tenantId: '324dsfsed',
        username: '324sffd',
        localAccountId: '32gdfe434'
      };
      const newState = { ...initialState, accountInfo: account, status: Status.Success };

      const action = checkIsAuthenticatedSuccess({ account });
      const state = fromUserReducers.userReducers(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('should retrieve error and update state', () => {
      const newState = { ...initialState, status: Status.Error, error: 'Something screwed up!' };

      const action = checkIsAuthenticatedFailure({ error: newState.error });
      const state = fromUserReducers.userReducers(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });
});
