import { Component, OnInit } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

import { StoreService } from '../../services/store.service'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  activeMenu = false;
  counter = 0;
  profile: User | null = null;

  constructor(
    private storeService: StoreService,
    private authService:AuthService
  ) { }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length;
    });
    /* this.authService.profileStore$.subscribe(profile => {
      console.log('init',profile);
      this.profile = profile;
    }); */
   
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  
  login(){
    this.authService.loginAndGet('diego@mail.com', '123')
    .subscribe(user => {
      this.profile = user;
    })
  }

  /* sin interceptor */
  /* login(){
    this.authService
    .login('diego@mail.com', '123')
    .pipe(
      // tap( token =>this.token = token.access_token),  //ya se guarda en el interceptor(localStorage)
      switchMap((res) => this.authService.getProfile()),
      switchMap((profile) => this.authService.setCurrentProfile(profile).pipe(
        map(item =>{
          this.profile = item
        })
      )
      )
    ).subscribe()
  } */  
  

/* 
  login() {
    this.authService.loginAndGet("diego@mail.com", "123")
    .subscribe(rta => {
     console.log(rta);
    })
  } */


/*   login(){
    this.authService.login("diego@mail.com", "123")
    .pipe(
      switchMap(({access_token})=>{
        return this.authService.getProfile(access_token).pipe(
          map(item =>{
            this.profile = item,
            this.token = access_token
          })
        )
      })
    ).subscribe(response=>{      
      console.log(response);
    })
  } */



/*   login(){
    this.authService.login("diego@mail.com", "123")
    .subscribe(rta => {
      console.log(rta.access_token);
      this.token = rta.access_token;
      this.getProfile();
    })
  }

  getProfile(){
    this.authService.getProfile(this.token)
    .subscribe(user =>{
    this.profile = user;
    });
  } */

}
