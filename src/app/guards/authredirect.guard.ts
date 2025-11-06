import { Injectable, Signal } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { UserFacade } from '../state/user/user.facade';

@Injectable({ providedIn: 'root' })
export class AuthRedirectGuard implements CanActivate {
  private isAuthenticated$$: Signal<boolean>;
  constructor(private userFacade: UserFacade, private router: Router) {
    this.isAuthenticated$$ = toSignal(this.userFacade.accountInfo$.pipe(map(a => !!a)), { initialValue: false });

    this.userFacade.accountInfo$.subscribe(ai => {
      setTimeout(() => {
        if (!ai) {
          this.redirectToHome();
        }
      }, 1000);
    });
  }

  canActivate(): boolean {
    return this.isAuthenticated$$();
  }

  private redirectToHome(): void {
    console.debug('[AUTHREDIRECT GUARD] Unauthenticated user, redirecting to home');
    this.router.navigate(['']);
  }
}
