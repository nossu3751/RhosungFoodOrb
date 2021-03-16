import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  page:string;
  constructor(private route:ActivatedRoute) {
    this.page = "Profile";
  }

  pageEqual(compare:string):Promise<boolean>{
    return new Promise<boolean>(
      (type)=>{
        type(this.page === compare);
      }
    )
  }

  profile(){
    this.page = "Profile";
    
    console.log(this.page);
  }

  track(){
    this.page = "Track";
    
    console.log(this.page);
  }

  payment(){
    this.page = "Payment";
    
    console.log(this.page);
  }

  ngOnInit(): void {
    let param = this.route.snapshot.params['page'];
    this.page = param?param:"Profile";
  }

}
