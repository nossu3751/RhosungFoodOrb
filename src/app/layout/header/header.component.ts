import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../registration/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currUser:User|null;
  userNameClicked:boolean;
  constructor(private router:Router, private _userService:UserService) { 
    let userJson = sessionStorage.getItem("user");
    this.currUser = userJson != null ? JSON.parse(userJson):null;
    this.userNameClicked = false;
  }

  goHome(){
    this.router.navigate(['/']);
  }

  logOutUser(){
    if(this.currUser != null){
      this._userService.logoutUser(this.currUser);
    }
    this.currUser = null;
    this.router.navigateByUrl('/logout',{skipLocationChange:true}).then(()=>
    this.router.navigate(['/']));
  }

  goToFriendList(){
    this.router.navigate(['/friends']);
  }

  goToCart(){
    this.router.navigate(['/orders']);
  }

  goToSignUpPage(){
    this.router.navigate(['/register']);
  }

  goToSettings(){
    this.router.navigate(['/settings']);
  }

  goToLogInPage(){
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this._userService.loggedInUser.subscribe(
      (user)=>{
        if(user != null){
          this.currUser = user;
        }else{
          this._userService.getLoggedInUserFromSession().subscribe(
            (u)=>{
              this.currUser = u;
            }
          )
        }
      }
    )
  }

}
