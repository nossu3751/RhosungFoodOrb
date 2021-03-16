import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from '../user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileModel:FormGroup;
  currUser:User|null;
  errorMsg:string;
  loading:boolean;
  constructor(private _userService:UserService, private router:Router, private formBuilder:FormBuilder) { 
    this.currUser = null;
    this.profileModel = formBuilder.group(
      {
        name:['',[Validators.required]],
        phone:['',[Validators.required,Validators.pattern('(([0-9]{3})(-|\s?)([0-9]{3})(-|\s?)([0-9]{4}))')]],
        email:['',[Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
        password:['',[Validators.required]]
      }
    );
    this.errorMsg = "";
    this.loading = false;
  }

  onEdit(){
    this.loading = true;
    setTimeout(()=>{
      this.loading = false;
    }, 500);
    if(this.currUser == null){
      alert("Please Log in Again!");
      this.router.navigate(['/login']);
    }else{
      this.currUser.name = this.profileModel.get("name")?.value;
      this.currUser.email = this.profileModel.get("email")?.value;
      this.currUser.phone = this.profileModel.get("phone")?.value;
      this.currUser.phone = this.profileModel.get("password")?.value;
      this._userService.updateUser(this.currUser).then(
        (response)=>{
          if(response == true){
            this.errorMsg = "Successfully Updated Data!";
          }else{
            this.errorMsg = "Couldn't update the data!";
          }
        }
      )
    }
  }

  ngOnInit(): void {
    this._userService.getLoggedInUserFromSession().subscribe(
      (user)=>{
        if(user == null || user === undefined){
          this.router.navigate(['/login']);
        }else{
          this.currUser = user;
          this.profileModel.controls['name'].setValue(user.name);
          this.profileModel.controls['email'].setValue(user.email);
          this.profileModel.controls['phone'].setValue(user.phone);
          this.profileModel.controls['password'].setValue(user.phone);
        }
      }
    )
  }
}
