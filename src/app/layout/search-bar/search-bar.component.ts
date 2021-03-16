import { Component, OnInit } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import {Router} from '@angular/router';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  search:string;
  type:string;

  constructor(private _foodFeedService: FeedService,private router:Router) {
    this.type = "all";
    this.search = "";
  }

  searchFood(type:string, search:string){
    this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>
    this.router.navigate(['/feed',{type: type, search: search}]));
  }

  ngOnInit(): void {
    console.log(this.search);
  }

}
