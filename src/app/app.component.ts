import { Component } from '@angular/core';

import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service'; 
/* import { Product } from './models/product.model'; */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = '';
  showImg = true;
  token='';

  constructor(
    private authService:AuthService,
    private usersService:UsersService
  ){

  }

  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser(){
    this.usersService.create({
      name: "Diego",
      email: "diego@mail.com" ,
      password: "123"
    })
    .subscribe(rta =>{
      console.log(rta);
    })
  }

  login(){
    this.authService.login("diego@mail.com", "123")
    .subscribe(rta => {
      console.log(rta.access_token);
      this.token = rta.access_token;
    })
  }

  getProfile(){
    return this.authService.getProfile()
    .subscribe(profile => {
      console.log(profile);
    })
  }
}
