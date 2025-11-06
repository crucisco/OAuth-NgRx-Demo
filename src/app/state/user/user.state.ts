import { AccountInfo } from "@azure/msal-browser";
import { UserProfile } from "../../models/userProfile";
import { Status } from "../../models/status";

export interface UserState {
  profile: UserProfile | undefined;
  accountInfo: AccountInfo | undefined;
  status: Status;
  error: string | null;
}

export const initialState: UserState = {
  profile: undefined,
  accountInfo: undefined,
  status: Status.Initialised,
  error: null,
};
