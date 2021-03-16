import { Injectable } from '@angular/core';
import { FoodFeed} from '../listing/food-listings/foodfeed';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

import { fromEventPattern } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private url:string;

  constructor(private http: HttpClient) {
    this.url = "http://localhost:3000/feed";

  }

  getFoodFeed():Observable<any>{
    return this.http.get<any>(this.url);
  }

  
  
}
