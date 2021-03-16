import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [

    './login.component.css',
  ]

})
export class LoginComponent implements OnInit {
  logInModel:FormGroup;
  errorMsg:string;
  constructor(private _userService:UserService, private formBuilder:FormBuilder, private router:Router) { 
    this.logInModel = formBuilder.group(
      {
        email:['',[Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
        password:['',[Validators.required]]
      }
    )
    this.errorMsg="";
  }

  logInUser(){
    if(this.logInModel.invalid){
      this.errorMsg = "Please Input Valid Information.";
      return;
    }else{
      let email = this.logInModel.value.email;
      let password = this.logInModel.value.password;

      this._userService.loginUser(null, email, password).then(
        (data:boolean) => {
          this._userService.errorMsg.subscribe(
            (msg) => {
              if(msg === ""){
                this.router.navigate(['/']);
              }else{
                this.errorMsg = msg;
              }
            }
          )
        }
      )
    }
  }

  ngOnInit(): void {

  }

}
