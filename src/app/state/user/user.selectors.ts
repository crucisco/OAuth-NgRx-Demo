import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

// Feature selector for the profile state
export const selectUserState = (state: AppState) => state.userState;

// Selector for the profile data
export const selectProfile = createSelector(
  selectUserState,
  (state) => state.profile
);

// Selector for the account data
export const selectAccount = createSelector(
  selectUserState,
  (state) => state.accountInfo
);

// Selector for the loading status
export const selectDataLoading = createSelector(
  selectUserState,
  (state) => state.status
);

// Selector for the error
export const selectDataError = createSelector(
  selectUserState,
  (state) => state.error
);
