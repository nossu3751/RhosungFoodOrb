import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from 'src/app/registration/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
  userList:User[];
  // currUser:BehaviorSubject<User|null>;
  currUser:User|null;
  searchText:string;
  @Output("reloadSentRequest") reloadSentRequest: EventEmitter<any>;
  constructor(private _userService:UserService, private router:Router) { 
    this.userList = [];
    this.currUser = null;
    this.searchText = "";
    this.reloadSentRequest = new EventEmitter();
    // this.currUser = new BehaviorSubject<User|null>(null);
  }

  areFriends(user:User, friend:User):Promise<boolean>{
    return this._userService.areFriends(user,friend);
  }

  filterSearch(search:string):User[]{
    if(search===""){
      return this.userList;
    }else{
      let length = search.length;
      let searchResult = this.userList.filter(
        (u:any)=>{
          let match = u.name.substring(0,length).toLowerCase() === search.toLowerCase();
          return match;
        }
      )
      return searchResult;
    }
    
  }

  friendRequest(friend:User){
    if(this.currUser == null){
      this.router.navigate(['/login']);
    }else{
      this._userService.requestFriend(this.currUser, friend).then(
        (response)=>{
          if(response == true){
            console.log("successfully added friend");
            this.userList = this.userList.filter(
              (u:any)=>{
                return u.id != friend.id;
              }
            );
            this.reloadSentRequest.emit({event:event, user:friend});
          }else{
            console.log("Failed to add friend");
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
          this._userService.getUserFriends(user).then(
            (data)=>{
              
              let friendIds = new Set();
              for(let d of data){
                friendIds.add(d.friendId);
              }
              
              this._userService.getUserList().subscribe(
                (list)=>{
                  let notFriends = list.filter(
                    (f:any) => {
                      let isFriend = friendIds.has(f.id) || f.id == user.id;
                      
                      return !isFriend;
                    }
                  )
                  
                  this.userList = notFriends;
                }
              )
            }
          )
        }
      }
    )
  }

}
