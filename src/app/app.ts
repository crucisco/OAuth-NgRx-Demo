import { Component, effect, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { WindowsService } from './services/windows.service';
import { LoginComponent } from './login/login.component';
import { UserFacade } from './state/user/user.facade';

@Component({
  standalone: true,
  selector: 'app-root',
  providers: [WindowsService],
  imports: [LoginComponent, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected title = 'OAuth NgRx Demo';
  protected isInIframe: boolean = false;

  constructor(private userFacade: UserFacade, private windowsService: WindowsService) {
    effect(() => {
      this.isInIframe = this.windowsService.isInIframe();
    });
  }

  ngOnInit(): void {
    console.debug('[APP COMPONENT] Initialising, checking authentication status');
    this.userFacade.checkIsAuthenticated();
  }
}
