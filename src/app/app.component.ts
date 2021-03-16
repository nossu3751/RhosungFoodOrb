import { Component } from '@angular/core';
import { User } from './registration/user';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rhosung-foodorb';
  loggedIn:boolean  = false;
  loggedInUser:User|null = null;
  public showOverlay = true;
  public removeOverlay = false;
  constructor(private router: Router){
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event)
    })
  }
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.showOverlay = true;
    }
    if (event instanceof NavigationEnd) {
      setTimeout(
        ()=>{
          this.showOverlay = false;
          this.removeOverlay = true;
          setTimeout(
            ()=>{
              this.removeOverlay = false;
            },
            150
          );
        }, 
        500
      );
    }

    if (event instanceof NavigationCancel) {
      this.showOverlay = false;
    }
    if (event instanceof NavigationError) {
      this.showOverlay = false;
    }
  }

  logInUser(){
    this.loggedIn = true;
  }
}
