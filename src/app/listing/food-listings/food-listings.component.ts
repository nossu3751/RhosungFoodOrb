import { Component, OnInit } from '@angular/core';
import { FoodFeed} from './foodfeed';
import { FeedService } from '../../services/feed.service';
import {Router, ActivatedRoute} from '@angular/router';
import {NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Order } from 'src/app/ordering/order';
import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/registration/user';


@Component({
  selector: 'app-food-listings',
  templateUrl: './food-listings.component.html',
  styleUrls: ['./food-listings.component.css'],
})
export class FoodListingsComponent implements OnInit {

  public foodList:FoodFeed[];
  public foodPageList:Array<FoodFeed[]>;
  public searchedFoodList:FoodFeed[];
  public errorMessage:string;
  public currPage:number;
  public searchType:string;
  public searchWord:string;
  public foodOrder:FoodFeed|null;
  public currUser:User|null;
 

  constructor(
      private _foodFeedService: FeedService, 
      private route: ActivatedRoute,
      private router:Router,
      private modalService: NgbModal,
      private _orderService: OrdersService,
      private _userService: UserService
    ) {
    this.foodList = [];
    this.foodPageList = [];
    this.searchedFoodList = [];
    this.errorMessage = "";
    this.currPage = 1;
    this.searchType = "all";
    this.searchWord = "";
    this.foodOrder = null;
    this.currUser = null;
  }

  open(content:any, food:FoodFeed|null) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.foodOrder = food;
  }

  orderFood(food:FoodFeed|null){
    if(food == null){
      alert("failed to add food");
    }else if(this.currUser == null){
      this.router.navigate(['/login']);
    }else{
      let user = this.currUser;
      this._orderService.getNextId().then(
        (id:number)=>{
          let order:Order = {
            id:id,
            userId:user.id,
            created_at:"",
            updated_at:"",
            name: food.name,
            restaurent_name: food.restaurent_name,
            quantity:1,
            item_cost:food.cost,
            status:"PROCESSING",
            wait_time:300
          };
          this._orderService.orderFood(order).then(
            (success)=>{
              if(success == true){
                alert("Item successfully added!");
              }else{
                alert("Failed to add item");
              }
            }
          )
        }
      )
    }
  }

  addToCart(food:FoodFeed|null){
    if(food == null){
      console.log("failed to add food");
      alert("failed to add food");
    }else if(this.currUser == null){
      console.log("log in first");
      alert("Please log in to order.");
      this.router.navigate(['/login']);
    }else{
      let user:User = this.currUser;
      this._orderService.getNextId().then(
        (id:number)=>{
          console.log("id:",id);
          console.log("user",this.currUser);
          let order:Order = {
            id:id,
            userId:user.id,
            created_at:"",
            updated_at:"",
            name: food.name,
            restaurent_name: food.restaurent_name,
            quantity:1,
            item_cost:food.cost,
            status:"in_cart",
            wait_time:300
          }
          console.log(order);
          this._orderService.addOrdersInCart2(order,this.currUser).then(
            (success)=>{
              if(success == true){
                console.log("item added");
                alert("Item successfully added!");
              }else{
                console.log("failed to add item");
                alert("Failed to add item! Please try again.")
              }
              this.foodOrder = null;
            }
          )
          
        }
      )
    }
    
  }

  goToOrderStatus(){
    this.router.navigate(['/settings',"Track"]);
  }
  

  numberRating(rating:string|undefined){
    if(rating === undefined) return 0;
    return parseFloat(rating);
  }

  goToPage(page:number){
    this.currPage = page;
  }

  private splitList(fl:FoodFeed[]):Array<FoodFeed[]>{
    var pagedList:Array<FoodFeed[]> = [];
    var currPageFeed:FoodFeed[] = [];

    for(let i = 0; i < fl.length; i++){
      currPageFeed.push(fl[i]);
      if(i % 6 == 5 || i == fl.length-1){
        let thisPage = [...currPageFeed]
        pagedList.push(thisPage);
        currPageFeed = [];
      }
    }

    return pagedList;
  }

  loadFoodFeedToArray(type?:string, search?:string){
    this._foodFeedService.getFoodFeed().subscribe(
      (response: any) => {
        console.log(response);
        this.foodList = response as FoodFeed[];

        if(search != null && search !== ""){
          if(type != null && type === "food"){
            this.foodList = this.foodList.filter(
              f => f.name.toLowerCase().includes(search.toLowerCase())
            );
            console.log(this.foodList);
          }else if(type != null && type === "restaurant"){
            this.foodList = this.foodList.filter(
              f => f.restaurent_name.toLowerCase().includes(search.toLowerCase())
            );
          }else if(type != null && type === "all"){
            this.foodList = this.foodList.filter(
              f => (
                f.restaurent_name.toLowerCase().includes(search.toLowerCase()) || 
                f.name.toLowerCase().includes(search.toLowerCase())
              )
            );
          }
        }
        this.foodPageList = this.splitList(this.foodList);
      },
      (error) => {
        this.errorMessage = error;
        console.log(error);
      }
    )
  }




  ngOnInit(): void {
    let search = this.route.snapshot.params['search'];
    let type = this.route.snapshot.params['type'];
    console.log(type);
    console.log(search);
    if(search == null || type == null){
      this.loadFoodFeedToArray();
    }else{
      this.searchType = type;
      this.searchWord = search;
      this.loadFoodFeedToArray(type,search);
    }
    this._userService.loggedInUser.subscribe(
      (user)=>{
        if(user != null){
          this.currUser = user;
        }else{
          this._userService.getLoggedInUserFromSession().subscribe(
            (u)=>{
              this.currUser = u;
              console.log(this.currUser);
            }
          )
        }
      }
    )
    console.log(search == null?"no search":"search");
    
    
     
    
  }

}
