import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from '../order';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
  orderTrackList:Order[];
  constructor(private _orderService:OrdersService, private _userService:UserService, private router:Router) { 
    this.orderTrackList = [];
  }

  ngOnInit(): void {
    this._userService.getLoggedInUserFromSession().subscribe(
      (user)=>{
        if(user == null){
          this.router.navigate(['/login']);
        }else{
          this._orderService.getUserOrders(user).then(
            (response)=>{
              if(response != null){
                console.log(response);
                let processing = response.filter(
                  (o:Order)=>{
                    return o.status === "PROCESSING" || o.status === "DELIVERED";
                  }
                )
                this.orderTrackList = processing;
              }
            }
          )
        }
      }
    )
  }

}
