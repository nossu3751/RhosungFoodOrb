import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/registration/user';
import { UserService } from 'src/app/services/user.service';
import { Order } from '../order';
import {NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-track-detail',
  templateUrl: './track-detail.component.html',
  styleUrls: ['./track-detail.component.css']
})
export class TrackDetailComponent implements OnInit {
  @Input() trackDetail: Order|null;
  currUser:User|null;
  order:Order|null;
  @Input() status: String;

  timeLeft: number;

  constructor(private _orderService:OrdersService, private _userService:UserService, private router:Router,private modalService: NgbModal) { 
    this.trackDetail = null;
    this.currUser = null;
    this.order = null;
    this.status = "";
    this.timeLeft = 30;
  }

  cancelOrder(){
    if(this.currUser == null || this.trackDetail == null){
      alert("Can't Delete!");
    }else{
      this._orderService.deleteUserOrder(this.currUser,this.trackDetail.id).then(
        (success)=>{
          if(success == true){
            this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>
            this.router.navigate(['/settings',"Track"]));
            alert("Successfully Deleted!")
          }else{
            alert("Can't delete!")
          }
        }
      )
    }
  }

  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }
  
  ngOnInit(): void {
    this._userService.getLoggedInUserFromSession().subscribe(
      (user)=>{
        if(user == null){
          this.router.navigate(['/login']);
        }else{
          this.currUser = user;
          if(this.trackDetail?.status === "PROCESSING"){
            setInterval(()=>{
              if(this.timeLeft > 0){
                this.timeLeft--;
                if(this.timeLeft == 20){
                  this.status = "PICKED UP";
                }else if(this.timeLeft == 10){
                  this.status = "On It's Way..."
                }else if(this.timeLeft == 0){
                  this.status = "Delivered!";  
                }
              }else{         
                if(this.trackDetail != null){
                  this._orderService.setDelivered(this.trackDetail).then(
                    (response)=>{
                      if(response == true){
                        
                      }else{
                        this.status = "Failed to deliver. Trying Again...";
                        this.timeLeft = 30;
                      }
                    }
                  )
                }  
              }
            },1000);
          }
        }
      }
    )
  }

}
