import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { BehaviorSubject, Observable , of} from 'rxjs';
import { User } from '../registration/user';
import { filter, find } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class UserService {
  public loggedInUser:BehaviorSubject<User|null>;
  private url:string;
  private friendsUrl:string;
  public loggedIn = new BehaviorSubject<boolean>(false);
  public errorMsg:BehaviorSubject<string>;

  constructor(private http: HttpClient) { 
    this.loggedInUser = new BehaviorSubject<User|null>(null);
    this.url = "http://localhost:3000/users";
    this.friendsUrl = "http://localhost:3000/friends"
    this.errorMsg =  new BehaviorSubject<string>("");
  }

  updateUser(user:User):Promise<boolean>{
    return new Promise<boolean>(
      response => {
        this.http.put(this.url + "/" + user.id, user).subscribe(
          {
            next: data => {
              console.log(data);
              sessionStorage.setItem('user', JSON.stringify(user));
              console.log(sessionStorage.getItem('user'));
              this.loggedInUser.next(user);
              response(true);
            },  
            error: error => {
              console.log(error);
              response(false);
            }
          }
        )
      }
    )
  }

  getUserById(id:number):Promise<User>{
    return new Promise<User>(
      (response)=>{
        this.getUserList().subscribe(
          (data)=>{
            let targetUser = data.filter(
              (u:any) => {
                return u.id == id;
              }
            );
            response(targetUser);
          }
        )
      }
    )
  }

  areFriends(user:User, friend:User):Promise<boolean>{
    return new Promise<boolean>(
      (response)=>{
        this.getUserFriends(user).then(
          (data)=>{
            let search = data.find(
              (f:any)=>{
                let exists = f.friendId == friend.id;
                return exists;
              }
            );
            if(search == null || search === undefined){
              response(false);
            }else{
              response(true);
            }
          }
        )
      }
    )
  }

  acceptFriend(user:User, friend:User):Promise<{success:boolean, data:any}>{
    return new Promise<{success:boolean, data:any}>(
      (success)=>{
        this.getUserFriends(user).then(
          (userList) => {
            console.log(userList);
            this.getUserFriends(friend).then(
              (friendList)=>{
                console.log(friendList);
                let userToFriend = userList.find(
                  (u:any) => {
                    return u.friendId == friend.id;
                  }
                );
                console.log(userToFriend);
                let friendToUser = friendList.find(
                  (f:any) => {
                    return f.friendId == user.id;
                  }
                );
                console.log(userToFriend);
                console.log(friendToUser);
                console.log(friendToUser.id);
                console.log(userToFriend.id);
                userToFriend.status = "friends";
                friendToUser.status = "friends";
                this.http.put(this.friendsUrl + "/" + userToFriend.id, userToFriend).subscribe({
                  next: data1 => {
                    this.http.put(this.friendsUrl + "/" + friendToUser.id, friendToUser).subscribe({
                      next: data2 => {
                        this.getUserFriends(user).then(
                          (friendList)=> {
                            console.log(friendList);
                            let approvedFriend = friendList.filter(
                              (f:any)=> (f.status === "friends")
                            )
                            console.log(approvedFriend);

                            success({success:true, data:approvedFriend});
                          }
                        )
                      },
                      error: error2 =>{
                        success({success:false, data:null});
                      }
                    })
                  },
                  error: error1 => {
                    success({success:false, data:null});
                  }
                })
              }
            )
          }
        )
      }
    )
  }

  requestFriend(user:User, friend:User):Promise<boolean>{
    return new Promise<boolean>(
      (success)=>{
        this.getUserFriends(user).then(
          (response)=>{
            if(response !== [] && response == null){
              console.log("can't fetch friends");
              success(false);
            }
            console.log(response);
            let targetFriend = response.find(
              (f:any)=>{
                console.log("id",f.friendId);
                console.log("id",friend.id);
                return f.friendId == friend.id
              }
            )
            console.log(targetFriend);
            if(targetFriend != null && targetFriend !== undefined){
              alert("Already friend, or request already made!")
              success(false);
            }else{
              let sentFriendRequest = {
                "userId":user.id,
                "friendId":friend.id,
                "status":"request_sent"
              };
              this.http.post<any>(this.friendsUrl, sentFriendRequest).subscribe({
                next: data => {
                  console.log(data);
                  let receivedFriendRequest = {
                    "userId":friend.id,
                    "friendId":user.id,
                    "status":"request_received"
                  };
                  this.http.post<any>(this.friendsUrl, receivedFriendRequest).subscribe(
                    (request)=>{
                      console.log(request);
                      alert("Friend Request Sent.")
                      success(true);
                    }
                  )
                },
                error: error => {
                  console.log("failed");
                  success(false);
                }
              })
            }
          },
          (error)=>{
            console.log("failed");
            success(false);
          }
        )
      }
    )
  }
  getAllFriends(){
    return this.http.get<any>(this.friendsUrl);
  }
  getUserFriends2(user:User):Observable<any>{
    return this.getAllFriends().pipe(
      filter(
        (u) => (u.id == user.id)
      )
    )
  }

  getUserFriends(user:User):Promise<any>{
    return new Promise<any>(
      (response)=>{
        this.getAllFriends().subscribe(
          {
            next: data=>{
              console.log(data);
              let friends = data.filter(
                (u:any) => { 
                  let userMatch = u.userId == user.id;
                  return userMatch;
                }
              );
              response(friends);
            },
            error: error=>{
              alert("Some error occurred... Please refresh the page.")
              response(null);
            }
          }
        )
      }
    )
  }

  getUsersFromFriendData(fdata:any):Promise<any>{
    return new Promise<any>(
      response => {
        let fid = new Set();
        let rsid = new Set();
        let rrid = new Set();
        for(let u of fdata){
          if(u.status === "friends"){
            fid.add(u.friendId);
          }else if(u.status === "request_sent"){
            rsid.add(u.friendId);
          }else if(u.status === "request_received"){
            rrid.add(u.friendId);
          }
        }
        this.getUserList().subscribe(
          (udata)=>{
            let friendUsers = udata.filter(
              (user:any) => {
                return fid.has(user.id);
              }
            );
            console.log(friendUsers);
            let requestSentUsers = udata.filter(
              (user:any) => {
                return rsid.has(user.id);
              }
            );
            console.log(requestSentUsers);
            let requestReceivedUsers = udata.filter(
              (user:any) => {
                return rrid.has(user.id);
              }
            );
            console.log(requestReceivedUsers);
            response({
              friends:friendUsers, 
              request_sent: requestSentUsers, 
              request_received: requestReceivedUsers
            });
          }
        )
      }
    )
  }

  getLoggedInUserFromSession():Observable<User|null>{
    let currUser = sessionStorage.getItem('user');
    if(currUser == null || currUser === undefined){
      return of(null);
    }else{
      let user = JSON.parse(currUser) as User;
      console.log(user);
      return of(
        user
      );
    }
  }
  
  getNextId():Promise<number>{
    return new Promise(number=>{
      this.getUserList().subscribe(
        (response:any) => {
          let dbSize = response.length;
          let id = response[dbSize-1]["id"];
          number(id+1);
        }
      )
    })
  }


  loginUser(user?:User|null, email?:string|null, password?:string|null):Promise<boolean>{
    return new Promise(success=>{
      this.getUserList().subscribe(
        (response:User[]) => {
          var u = null;
          if(user != null){
            u = response.find(f => (f.id == user.id && f.password === user.password))
          }else if(email != null && password != null){
            u = response.find(f => f.email === email && f.password === password);
          }else{
            alert("failed to log in");
            success(false);
            return;
          }
          if(u !== undefined){
            sessionStorage.setItem("user",JSON.stringify(u));
            this.loggedInUser.next(u != undefined? u:null);
            this.loggedIn.next(true);
            this.errorMsg.next("");
            success(true);
          }else{
            this.errorMsg.next("Wrong Credentials. Please Log In Again.");
            success(false);
            alert("failed to log in");
          }
          console.log(sessionStorage.getItem("user"));
        }
      )
    })
  }

  logoutUser(user:User){
    if(user != null){
      sessionStorage.removeItem("user");
      this.loggedInUser.next(null);
      this.loggedIn.next(false);
    }
  }

  getUserList():Observable<any>{
    return this.http.get<any>(this.url);
  }

  

  addUser(user:User):Promise<boolean>{
    return new Promise<boolean>(
      success => {
        this.getUserList().subscribe(
          (response)=>{
            let u = response.find(
              (f: any) => (
                f.email != null && f.email !== undefined && f.email === user.email
              )
            );
            if(u != null && u !== undefined){
              this.errorMsg.next("This email already exists. Please try another email.")
              success(false);
            }else{
              this.http.post<any>(this.url, user).subscribe({
                next: data => {
                  success(true);
                  this.errorMsg.next("");
                  console.log(data);
                  this.loginUser(user);
                  console.log(sessionStorage.getItem("user"));
                },
                error: error => {
                  console.log(error);
                }
              })
            }
          }
        )
      }
    )
  }
}
