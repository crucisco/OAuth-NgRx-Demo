import { selectProfile, selectAccount, selectDataLoading, selectDataError } from "./user.selectors";
import { AppState } from "../app.state";
import { Status } from "../../models/status";

describe('UserSelectors', () => {
  describe('Initial state', () => {
    const initialState: AppState = {
      userState: {
        accountInfo: undefined,
        profile: undefined,
        status: Status.Initialised,
        error: null
      }
    }

    it('should select the profile', () => {
      const result = selectProfile.projector(initialState.userState);
      expect(result).toBeUndefined();
    })

    it('should select account', () => {
      const result = selectAccount.projector(initialState.userState);
      expect(result).toBeUndefined();
    });

    it('should show data status as "Initialised"', () => {
      const result = selectDataLoading.projector(initialState.userState);
      expect(result).toBe(Status.Initialised);
    });

    it('should show error as null', () => {
      const result = selectDataError.projector(initialState.userState);
      expect(result).toBeNull();
    });
  });

  describe('Error state', () => {
    const errorState: AppState = {
      userState: {
        accountInfo: undefined,
        profile: undefined,
        status: Status.Error,
        error: 'Something broke!'
      }
    }

    it('should show data status as "Error"', () => {
      const result = selectDataLoading.projector(errorState.userState);
      expect(result).toBe(Status.Error);
    });

    it('should show error message', () => {
      const result = selectDataError.projector(errorState.userState);
      expect(result).toBe('Something broke!');
    });
  });
});
