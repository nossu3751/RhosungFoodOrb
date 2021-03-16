import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { RegistrationComponent } from './registration/registration/registration.component';
import { LoginComponent } from './registration/login/login.component';
import { ForgotPasswordComponent } from './registration/forgot-password/forgot-password.component';
import { ProfileComponent } from './registration/profile/profile.component';
import { SettingsComponent } from './registration/settings/settings.component';
import { FoodListingsComponent } from './listing/food-listings/food-listings.component';
import { FeedComponent } from './listing/feed/feed.component';
import { OrderComponent } from './ordering/order/order.component';
import { TrackComponent } from './ordering/track/track.component';
import { BrowseComponent } from './friend/browse/browse.component';
import { ConnectComponent } from './friend/connect/connect.component';
import { DisplayComponent } from './friend/display/display.component';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule} from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { SearchBarComponent } from './layout/search-bar/search-bar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { OrdersResolveService } from './services/orders-resolve.service';
import { TrackDetailComponent } from './ordering/track-detail/track-detail.component';

const ROUTES: Routes = [
  {path:'', component:HomeComponent},
  {path:'register', component:RegistrationComponent},
  {path:'login', component:LoginComponent},
  {path:'logout', component:LoginComponent},
  {path:'forgotPassword', component:ForgotPasswordComponent},
  {path:'friends', component:ConnectComponent},
  {path:'settings', component:SettingsComponent},
  {path:'settings/:page', component:SettingsComponent},
  {path:'feed', component:FoodListingsComponent},
  {path:'feed/:type/:search', component:FoodListingsComponent},
  {
    path:'orders', 
    component:OrderComponent,
    resolve:{
      data: OrdersResolveService
    }
  },
  {path:'orders/:id', component:TrackComponent},
  {path:'orders/:id/status', component:TrackComponent},
  


]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RegistrationComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    SettingsComponent,
    FoodListingsComponent,
    FeedComponent,
    OrderComponent,
    TrackComponent,
    BrowseComponent,
    ConnectComponent,
    DisplayComponent,
    HomeComponent,
    SearchBarComponent,
    TrackDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(ROUTES),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
