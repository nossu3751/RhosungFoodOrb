import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../user';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  regId:number;
  regUser:any;
  regUserModel: FormGroup;
  errorMsg:string;

  constructor(private _userService:UserService, private formBuilder:FormBuilder, private router:Router) {
    this.regUserModel= this.formBuilder.group(
      {
        firstName:['',[Validators.required]],
        lastName:['',[Validators.required]],
        phone:['',[Validators.required,Validators.pattern('(([0-9]{3})(-|\s?)([0-9]{3})(-|\s?)([0-9]{4}))')]],
        email:['',[Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
        passwordsGroup: this.formBuilder.group({
          password:['',[Validators.required]],
          cpassword:['',[Validators.required]]
        },{
          validators: this.confirmPassword
        }),
      }
    )
    this.regUser = this.emptyUser();
    this.errorMsg = "";
    this.regId = -1;


  }

  confirmPassword(formGroup:FormGroup){
    let password = formGroup.get('password')?.value;
    let cpassword = formGroup.get('cpassword')?.value;
    console.log("password:" + password + ",cpassword:" +cpassword);
    let isEqual = password != null && password === cpassword; 
    let error = isEqual?null:{mismatch:true};
    
    formGroup.controls['cpassword'].setErrors(error);
    
    return error;
  }

  passwordMismatch(){
    console.log(this.regUserModel.get('passwordsGroup.cpassword')?.errors);
    return this.regUserModel.get('passwordsGroup.cpassword')?.errors?.mismatch
  }

  emptyUser():User{
    return {
      id:-1,
      name:"",
      email:"",
      email_verified_at:"",
      created_at:"",
      updated_at:"",
      api_token:"",
      phone:"",
      password:"",
    }
  }

  addUser(){
    if(this.regUserModel.invalid){
      this.errorMsg = "Please Input Valid Information.";
      return;
    }else{
      let created_at:string = new Date().toTimeString();
      let updated_at:string = created_at;

      this._userService.getNextId().then(
        (id:number) => {
          console.log(id);
          let user = {
            id: id,
            name: this.regUserModel.value.firstName + " " + this.regUserModel.value.lastName,
            email: this.regUserModel.value.email,
            email_verified_at: "FoodOrb",
            created_at: created_at,
            updated_at: updated_at,
            api_token:"",
            phone:this.regUserModel.value.phone,
            password:this.regUserModel.value.passwordsGroup.password
          }
    
          console.log(user);
          this._userService.addUser(user).then(
            (success:boolean) => {
              if(success){
                this.errorMsg = "";
                this.router.navigate(['/']);
              }else{
                this.errorMsg = "The email is taken. Please try another email."
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
