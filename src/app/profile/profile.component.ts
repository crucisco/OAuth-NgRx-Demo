import { Component, Signal, signal } from '@angular/core';
import { UserProfile } from '../models/userProfile'; // Assuming you have a ProfileType defined
import { UserFacade } from '../state/user/user.facade';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Status } from '../models/status';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  imports: [CommonModule]
})
export class ProfileComponent {
  protected profile$: Observable<UserProfile | undefined> = of(undefined);
  protected loading$: Observable<Status> = of(Status.Loading);
  protected error$: Observable<string | null> = of(null);

  constructor(private readonly userFacade: UserFacade) {
    this.profile$ = this.userFacade.profile$;
    this.loading$ = this.userFacade.dataLoading$;
    this.error$ = this.userFacade.dataError$;
  }

  ngOnInit() {
    this.userFacade.loadProfile();
  }
}
