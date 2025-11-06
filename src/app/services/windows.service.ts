import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// Remove this service to use Angular Universal
export class WindowsService {
  public isInIframe = signal(false);

  constructor() {
    // This service can be used to check if the app is running in an iframe
    this.isInIframe.set(window !== window.parent && !window.opener);
  }
}
