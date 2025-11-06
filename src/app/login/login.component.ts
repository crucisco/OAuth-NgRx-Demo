import { Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { AccountInfo } from '@azure/msal-browser';
import { RouterLink } from '@angular/router';
import { UserFacade } from '../state/user/user.facade';
import { map, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  protected authenticatedAccount$: Observable<AccountInfo | undefined> = of(undefined);
  protected isAuthenticated$: Observable<boolean> = of(false);

  constructor(
    private userFacade: UserFacade
  ) {
    this.authenticatedAccount$ = userFacade.accountInfo$;
    this.isAuthenticated$ = userFacade.accountInfo$.pipe(map(ai => !!ai));
  }

  ngOnInit(): void {
    console.debug('[LOGIN]', 'ngOnInit');
  }

  ngOnDestroy(): void {
    console.debug('[LOGIN]', 'ngOnDestroy');
  }

  protected logIn() {
    this.userFacade.login();
  }

  protected logOut() {
    this.userFacade.logout();
  }
}
