import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/registration/user';
import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from '../order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  currUser:User|null;
  orderList:Order[];
  orderList2:Promise<Order[]>;
  totalPrice:BehaviorSubject<number>;
  constructor(
      private router:Router, 
      private _userService:UserService, 
      private _orderService:OrdersService,
      private _routes:ActivatedRoute
    ) {
        this.currUser = null;
        this.orderList=[];
        this.orderList2= this.getOrdersAsync();
        this.totalPrice = new BehaviorSubject<number>(0);
  }

  orderCart(){
    this.getOrdersAsync().then(
      (orders)=>{
        console.log("async order", orders);
        this._orderService.orderFromCart(orders).then(
          (success)=>{
            console.log(success);
            if(success == true){
              alert("Successfully ordered from cart!");
              this.router.navigate(['/settings',"Track"]);
            }else{
              alert("Failed to order from cart. Please try again.");
            }
          }
        )
      }
    )
  }

  // totalPrice(){
  //   var sum:number = 0;
  //   for(let o of this.orderList){
  //     let itemCost = parseInt(o.item_cost);
  //     let itemQuant = o.quantity;
  //     sum += itemCost * itemQuant;
  //   }
  //   return sum;
  // }

  itemTotalPrice(cost:string, quantity:number){
    let numCost = parseInt(cost);
    let itemTotal= numCost * quantity;
    return itemTotal;
  }


  // private loadOrders(user:User){
  //   this._orderService.getAllOrders().subscribe(
  //     (orders)=>{
  //       console.log(orders);
  //       this.orderList = orders.filter(
  //         (order:Order) => (
  //           order.userId == user.id && order.status === "in_cart"
  //         )
  //       );
  //       this.orderList = orders;
  //       console.log(this.orderList);
  //     },
  //     (error)=>{
  //       console.log("No Item in the list!");
  //     },
  //     ()=>{
  //       console.log("orders load completed");
  //     }
  //   )
  // }

  getOrdersAsync():Promise<Order[]>{
    return new Promise<Order[]>(
      (resolve)=>{
        this._userService.loggedInUser.subscribe(
          (user)=>{

            this._userService.getLoggedInUserFromSession().subscribe(
              (u)=>{
                if(u == null){
                  this.router.navigate(['/login']);
                }else{
                  this.currUser = u;
                  this._orderService.getAllOrders().subscribe(
                    (orders)=>{
                      console.log(orders);
                      let orderList = orders.filter(
                        (order:Order) => (
                          order.userId == u.id && order.status === "in_cart"
                        )
                      );
                      var sum = 0;
                      for(let o of orderList){
                        let itemCost = parseInt(o.item_cost);
                        let itemQuant = o.quantity;
                        sum += itemCost * itemQuant;
                      }
                      this.totalPrice.next(sum);
                      resolve(orderList);
                      console.log(this.orderList);
                    },
                  )
                  console.log("orderList",this.orderList);
                }
              }
            )
          }
        )
      }
    )
  }

  ngOnInit(): void {

      
        console.log("working!")
        // this._userService.loggedInUser.subscribe(
        //   (user)=>{
        //     if(user != null){
        //       this.currUser = user;
        //       console.log("currUser", this.currUser);
        //     }else{
        //       this._userService.getLoggedInUserFromSession().subscribe(
        //         (u)=>{
        //           if(u == null){
        //             this.router.navigate(['/login']);
        //           }else{
        //             this.currUser = u;
        //             this.loadOrders(this.currUser);
        //             console.log("orderList",this.orderList);
        //           }
        //         }
        //       )
        //     }
        //   }
        // )


    
  }

}
