import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Order } from '../ordering/order';
import { User } from '../registration/user';
import { OrdersService} from './orders.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersResolveService implements Resolve<any>{

  constructor() { }


  resolve(){
    return {completed:true};
  }
}
