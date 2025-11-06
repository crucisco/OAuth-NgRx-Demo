import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { UserProfile } from "../../models/userProfile";
import { Observable, of } from "rxjs";
import { selectAccount, selectDataError, selectDataLoading, selectProfile } from "./user.selectors";
import { AppState } from "../app.state";
import { checkIsAuthenticated, loadProfile, login, logout } from "./user.actions";
import { AccountInfo } from "@azure/msal-browser";
import { Status } from "../../models/status";

@Injectable({ providedIn: 'root' })
export class UserFacade {

  private store: Store<AppState> = inject(Store<AppState>);
  profile$: Observable<UserProfile | undefined> = this.store.select(selectProfile);
  accountInfo$: Observable<AccountInfo | undefined> = this.store.select(selectAccount);

  dataLoading$: Observable<Status> = this.store.select(selectDataLoading);
  dataError$: Observable<string | null> = this.store.select(selectDataError);

  constructor() { }

  loadProfile() {
    this.store.dispatch(loadProfile());
  }

  login() {
    this.store.dispatch(login());
  }

  logout() {
    this.store.dispatch(logout());
  }

  checkIsAuthenticated() {
    this.store.dispatch(checkIsAuthenticated());
  }
}
