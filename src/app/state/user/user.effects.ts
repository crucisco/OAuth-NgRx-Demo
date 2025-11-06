import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import * as UserActions from './user.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class UserEffects {
  private actions$: Actions = inject(Actions);
  private authService: AuthService = inject(AuthService);

  constructor(
  ) { }

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadProfile),
      mergeMap(() =>
        this.authService.getProfile().pipe(
          map(profile => UserActions.loadProfileSuccess({ profile })),
          catchError(error => of(UserActions.loadProfileFailure({ error })))
        )
      )
    )
  );

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.login),
      mergeMap(() => {
        this.authService.logIn();
        return this.authService.ActiveAccount$.pipe(
          map(account => UserActions.loginSuccess({ account: account! })),
          catchError(error => of(UserActions.loginFailure({ error })))
        )
      }
      )
    )
  });

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.logout),
      mergeMap(() => {
        this.authService.logOut();
        return this.authService.ActiveAccount$.pipe(
          map(() => UserActions.logoutSuccess()),
          catchError(error => of(UserActions.logoutFailure({ error })))
        )
      }
      )
    )
  );

  isAuthenticated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.checkIsAuthenticated),
      mergeMap(() => {
        this.authService.checkIfAuthenticated();
        return this.authService.ActiveAccount$.pipe(
          map((result) => UserActions.checkIsAuthenticatedSuccess({ account: result! })),
          catchError(error => of(UserActions.checkIsAuthenticatedFailure({error})))
          )

      })
    )
  );
}
