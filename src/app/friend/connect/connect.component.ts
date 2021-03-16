import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/registration/user';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})
export class ConnectComponent implements OnInit {
  currUser:User|null;
  friendList:BehaviorSubject<User[]>;
  requestReceivedList:BehaviorSubject<User[]>;
  requestSentList:BehaviorSubject<User[]>;
  constructor(private _userService:UserService, private router:Router) { 
    this.currUser = null;
    this.friendList = new BehaviorSubject<User[]>([]);
    this.requestReceivedList = new BehaviorSubject<User[]>([]);
    this.requestSentList = new BehaviorSubject<User[]>([]);

  }

  approveRequest(user:User|null|undefined, friend:User|null|undefined){
    if(user == null || friend == null || user == undefined || friend == undefined){
      alert("failed to approve friend request!");
    }else{
      this._userService.acceptFriend(user,friend).then(
        (response)=> {
          if(response.success == true){
            alert("successfully approved friend request!");
            this._userService.getUsersFromFriendData(response.data).then(
              (data)=>{
                console.log(data);
                let currFriends = this.friendList.value;
                currFriends.push(friend);
                this.friendList.next(currFriends);
                let removedRequestList = this.requestReceivedList.value.filter(
                  (f:any) => {
                    return f.id != friend.id;
                  }
                )
                this.requestReceivedList.next(removedRequestList);
              }
            )
          }else{
            alert("failed to approve friend request!");
          }
        }
      )
    }
  }

  reloadSentRequest(value:any){
    let sentList = this.requestSentList.value;
    sentList.push(value.user);
    this.requestSentList.next(sentList);
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
              console.log("friends", data)
              this._userService.getUsersFromFriendData(data).then(
                (response)=>{
                  this.friendList.next(response.friends);
                  this.requestSentList.next(response.request_sent);
                  this.requestReceivedList.next(response.request_received);
                  console.log(this.friendList.value);
                  console.log(this.requestReceivedList.value);
                  console.log(this.requestSentList.value);
                }
              )
            }
          )
        }
      }
    )
  }

}
