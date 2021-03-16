import { Injectable } from '@angular/core';
import { User } from '../registration/user';
import { FoodFeed} from '../listing/food-listings/foodfeed';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../ordering/order';
import { filter, find } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private url = "http://localhost:3000/orders";
  constructor(private http:HttpClient) { 
    
  }

  getUserOrders(user:User):Promise<Order[]|null>{
    return new Promise<Order[]|null>(
      (response)=>{
        this.getAllOrders().subscribe(
          (data)=>{
            let userOrders = data.filter(
              (f:Order)=>{
                return f.userId == user.id;
              }
            );
            console.log(userOrders);
            response(userOrders);
          },
          (error)=>{
            response(null);
          }
        )
      }
    )
  }

  deleteUserOrder(user:User, orderId:number):Promise<boolean>{
    return new Promise<boolean>(
      (response)=>{
        let deleteAddress = this.url + "/" + orderId;
        console.log(deleteAddress);
        this.http.delete(this.url + "/" + orderId).subscribe(
          (data)=>{
            console.log(data);
            response(true);
          },
          (error)=>{
            console.log(error);
            response(false);
          }
        )
      }
    )
  }

  getNextId():Promise<number>{
    return new Promise(number=>{
      this.getAllOrders().subscribe(
        (response:any) => {
          let dbSize = response.length;
          if(dbSize == 0){
            number(1);
          }else{
            let id = response[dbSize-1]["id"];
            number(id+1);
          }
        },
        (error)=>{
          number(1);
        }
      )
    })
  }

  orderFromCart(orders:Order[]):Promise<boolean>{
    return new Promise<boolean>(
      (response)=>{
        let orderPromise = this.orderFood(orders[0]);
        console.log("first order",orders[0]);
        for(let i = 1; i < orders.length; i++){
          orderPromise.then(
            (success)=>{
              orderPromise = this.orderFood(orders[i]);
              if(i == orders.length-1){
                orderPromise.then(
                  (res)=>{
                    if(res == true){
                      response(true);
                    }else{
                      response(false);
                    }
                  }
                )
              }
            },
            (error)=>{
              response(false);
              return;
            }
          )
        }
        if(orders.length < 2){
          orderPromise.then(
            (res)=>{
              if(res == true){
                response(true);
              }else{
                response(false);
              }
            }
          )
        }
      }
    )
  }

  setDelivered(order:Order):Promise<boolean>{
    return new Promise<boolean>(
      (response)=>{
        order.status = "DELIVERED";
        this.http.put(this.url + "/" + order.id, order).subscribe(
          (data)=>{
            response(true);
          },
          (error)=>{
            alert("Couldn't deliver");
            response(false);
          }
        )
      }
    )
  }

  orderFood(order:Order):Promise<boolean>{
    return new Promise<boolean>(
      (response)=>{
        this.getAllOrders().subscribe(
          (data:Order[])=>{
            let existing = data.find(
              (f:Order)=>{
                return f.id == order.id;
              }
            );
            if(existing == null || existing === undefined){
              this.http.post(this.url, order).subscribe(
                (res:any)=>{
                  response(true);
                },
                (error)=>{
                  console.log("couldn't order food");
                  response(false);
                }
              )
            }else{
              existing.status = "PROCESSING";
              this.http.put(this.url + "/" + existing.id, existing).subscribe(
                (res:any)=>{
                  response(true);
                },
                (error)=>{
                  console.log("couldn't order food");
                  response(false);
                }
              )
            }
          }
        )
      }
    )
  }

  addOrdersInCart2(order:Order, user:User|null):Promise<boolean>{
    return new Promise(
      (success)=>{
        if(user == null){
          console.log("logInRequired");
          success(false);
        }else{
          console.log("trying to add...");
          
          this.getAllOrders().subscribe(
            (data)=>{
              let prevOrder:Order = data.find(
                (o:Order) => (
                  o.userId == user.id && 
                  o.status === "in_cart" && 
                  o.name === order.name && 
                  o.restaurent_name === order.restaurent_name
                )
              )
              if(prevOrder === undefined || prevOrder == null){
                order.created_at = new Date().toTimeString();
                order.updated_at = new Date().toTimeString();
                this.http.post<Order>(this.url, order).subscribe({
                  next: data => {
                    console.log("added order", order);
                    success(true);
                  },
                  error: error => {
                    console.log("failed to add order");
                    success(false);
                  }
                });
              }else{
                order.created_at = prevOrder.created_at;
                order.updated_at = new Date().toTimeString();
                order.quantity = prevOrder.quantity + 1;
                let updateUrl = this.url + "/" + prevOrder.id;
                this.http.put<Order>(updateUrl, order).subscribe({
                  next: data => {
                    console.log("successfully added", data);
                    success(true);
                  },
                  error: error => {
                    console.log("failed to add order");
                    success(false);
                  }
                })
              }
            },
            (error)=>{
              console.log("failed to add order");
              success(false);
            }
          )
        }
      }
    )
  }

  // addOrdersInCart(order:Order, user:User|null):Promise<boolean>{
  //   return new Promise(
  //     (success)=>{
  //       if(user == null){
  //         console.log("logInRequired")
  //         success(false);
  //       }else{
  //         console.log("trying to add...")
  //         order.created_at = new Date().toTimeString();
  //         order.updated_at = order.created_at;
  //         this.http.post<Order>(this.url, order).subscribe({
  //           next: data => {
  //             console.log("added order",order);
  //             success(true);
  //           },
  //           error: error => {
  //             this.getOrdersInCart(user).pipe(
  //               (find(
  //                 (o:Order) => (
  //                   o.userId == user.id && 
  //                   o.status === "in_cart" && 
  //                   o.name === order.name && 
  //                   o.restaurent_name === order.restaurent_name
  //                 )
  //               ))
  //             ).subscribe(
  //               (response)=>{
  //                 if(response !== undefined && response != null){
  //                   order.created_at = new Date().toTimeString();
  //                   order.updated_at = order.created_at;
  //                   order.quantity = response.quantity + 1;
  //                   this.http.put<Order>(this.url + "/" + response.id, order).subscribe(
  //                     (data)=>{
  //                       success(true);
  //                       console.log("order updated!");
  //                     },
  //                     (error)=>{
  //                       success(false);
  //                       console.log("can't add this order somehow...");
  //                     }
  //                   )
  //                 }else{
  //                   success(false);
  //                   console.log("can't add this order somehow...");
  //                 }
  //               }
  //             )
  //           },
  //           complete: () => {
  //             console.log("request completed");
  //           }
  //         })
  //       }
  //     }
  //   )
  // }

  getAllOrders():Observable<any>{
    return this.http.get(this.url);
  }

  getOrdersInCart(user:User):Observable<any>{
    console.log("userid",user.id);
    let toReturn = this.http.get<Order>(this.url).pipe(
      filter((order:Order) => {
        console.log("this order",order);
        let equal = order?.userId !== undefined ? order.userId == user.id: false;
        return equal;
      })
    ); 
    console.log(toReturn);
    return toReturn; 
  }

}
