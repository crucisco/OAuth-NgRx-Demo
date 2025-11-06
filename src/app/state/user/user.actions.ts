import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../../models/userProfile';
import { AccountInfo } from '@azure/msal-browser';

export const loadProfile = createAction(
  '[User] Load Profile'
);

export const loadProfileSuccess = createAction(
  '[User] Load Profile Success',
  props<{ profile: UserProfile }>()
);

export const loadProfileFailure = createAction(
  '[User] Load Profile Failure',
  props<{ error: string | null }>()
);

export const login = createAction(
  '[User] Login'
);

export const loginSuccess = createAction(
  '[User] Login Success',
  props<{ account: AccountInfo }>()
);

export const loginFailure = createAction(
  '[User] Login Failure',
  props<{ error: string | null }>()
);

export const logout = createAction(
  '[User] Logout'
);

export const logoutSuccess = createAction(
  '[User] Logout Success'
);

export const logoutFailure = createAction(
  '[User] Logout Failure',
  props<{ error: string | null }>()
);

export const checkIsAuthenticated = createAction(
  '[User] Check Is Authenticated'
);

export const checkIsAuthenticatedSuccess = createAction(
  '[User] Check Is Authenticated Success',
  props<{ account: AccountInfo }>()
);

export const checkIsAuthenticatedFailure = createAction(
  '[User] Check Is Authenticated Failure',
  props<{ error: string | null }>()
);
