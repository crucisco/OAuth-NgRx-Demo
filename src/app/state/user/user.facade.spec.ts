import { TestBed } from "@angular/core/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { UserFacade } from "./user.facade";
import { initialState } from "./user.state";
import { selectAccount, selectProfile } from "./user.selectors";
import * as UserActions from "./user.actions";
import { provideZonelessChangeDetection } from "@angular/core";
import { UserProfile } from "../../models/userProfile";
import { AccountInfo } from "@azure/msal-browser";

describe('UserFacade', () => {
  let store: MockStore;
  let dispatchSpy: any;
  let facade: UserFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({
          initialState,
          selectors: [
            { selector: selectProfile, value: {} },
            { selector: selectAccount, value: {} },
          ]
        }),
      ],
    })

    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
    facade = TestBed.inject(UserFacade);
  });

  it('should dispatch loadProfile action when loadProfile called', () => {
    const profile: UserProfile = { id: '33' };
    store.overrideSelector(selectProfile, profile)

    facade.loadProfile();

    expect(dispatchSpy).toHaveBeenCalled();
    facade.profile$.subscribe(d => {
      expect(d?.id).toBe(profile.id);
    });
  });

  it('should dispatch login action when login called', () => {
    const account: AccountInfo = {
      localAccountId: '33',
      homeAccountId: "",
      environment: "",
      tenantId: "",
      username: ""
    };
    store.overrideSelector(selectAccount, account)

    facade.login();

    expect(dispatchSpy).toHaveBeenCalled();
    facade.accountInfo$.subscribe(d => {
      expect(d?.localAccountId).toBe(account.localAccountId);
    });
  });

  it('should dispatch logout action when logout called', () => {
    store.overrideSelector(selectAccount, undefined);
    store.overrideSelector(selectProfile, undefined);

    facade.logout();

    expect(dispatchSpy).toHaveBeenCalled();
    facade.accountInfo$.subscribe(d => {
      expect(d).toBeUndefined();
    });
    facade.profile$.subscribe(d => {
      expect(d).toBeUndefined();
    });
  });

  it('should dispatch checkIsAuthenticated action when checkIsAuthenticated called and not authenticated', () => {
    store.overrideSelector(selectAccount, undefined);
    store.overrideSelector(selectProfile, undefined);

    facade.checkIsAuthenticated();

    expect(dispatchSpy).toHaveBeenCalled();
    facade.accountInfo$.subscribe(d => {
      expect(d).toBeUndefined();
    });
    facade.profile$.subscribe(d => {
      expect(d).toBeUndefined();
    });
  });

  it('should dispatch checkIsAuthenticated action when checkIsAuthenticated called and authenticated', () => {
    const account: AccountInfo = {
      localAccountId: '33',
      homeAccountId: "",
      environment: "",
      tenantId: "",
      username: ""
    };
    store.overrideSelector(selectAccount, account)

    facade.checkIsAuthenticated();

    expect(dispatchSpy).toHaveBeenCalled();
    facade.accountInfo$.subscribe(d => {
      expect(d).toEqual(account);
    });
  });
});
