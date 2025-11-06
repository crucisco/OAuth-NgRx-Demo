import { Component, OnInit } from '@angular/core';
import { AccountInfo } from '@azure/msal-browser';
import { map, Observable, of } from 'rxjs';
import { UserFacade } from '../state/user/user.facade';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  protected authenticatedAccount$: Observable<AccountInfo | undefined> = of(undefined);
  protected isAuthenticated$: Observable<boolean> = of(false);

  constructor(private userFacade: UserFacade) {
    console.debug('[HOME] Constructor executed');
    this.authenticatedAccount$ = userFacade.accountInfo$;
    this.isAuthenticated$ = userFacade.accountInfo$.pipe(map(ai => !!ai));
  }

  ngOnInit(): void {
    console.debug('[HOME] ngOnInit executed');
  }

  logIn(): void {
    this.userFacade.login();
  }
}
