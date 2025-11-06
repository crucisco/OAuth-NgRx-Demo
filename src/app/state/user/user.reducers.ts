import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { Status } from '../../models/status';
import { initialState } from './user.state';


export const userReducers = createReducer(
  initialState,
  on(UserActions.loadProfile, state => ({
    ...state,
    status: Status.Loading,
    error: null
  })),
  on(UserActions.loadProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    status: Status.Success,
    error: null
  })),
  on(UserActions.loadProfileFailure, (state, { error }) => ({
    ...state,
    status: Status.Error,
    error
  })),
  // Login reducers
  on(UserActions.login, state => ({
    ...state,
    status: Status.Loading,
    error: null
  })),
  on(UserActions.loginSuccess, (state, { account }) => ({
    ...state,
    accountInfo: account,
    status: Status.Success,
    error: null
  })),
  on(UserActions.loginFailure, (state, { error }) => ({
    ...state,
    status: Status.Error,
    error
  })),
  // Logout reducers
  on(UserActions.logout, state => ({
    ...state,
    status: Status.Loading,
    error: null
  })),
  on(UserActions.logoutSuccess, state => ({
    ...state,
    accountInfo: undefined,
    profile: undefined,
    status: Status.Success,
    error: null
  })),
  on(UserActions.logoutFailure, (state, { error }) => ({
    ...state,
    status: Status.Error,
    error
  })),
  on(UserActions.checkIsAuthenticated, (state) => ({
    ...state,
    status: Status.Loading,
    error: null
  })),
  on(UserActions.checkIsAuthenticatedSuccess, (state, { account }) => ({
    ...state,
    accountInfo: account,
    status: Status.Success,
    error: null
  })),
  on(UserActions.checkIsAuthenticatedFailure, (state, {error}) => ({
    ...state,
    accountInfo: undefined,
    status: Status.Error,
    profile: undefined,
    error
  }))
);
