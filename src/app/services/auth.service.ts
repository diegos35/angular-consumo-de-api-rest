import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Auth } from './../models/auth.model';
import { User } from '../models/user.model';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl= `${environment.API_URL}api/auth`;

  constructor(
    private http: HttpClient
  ) { }


  login(email:string, password:string){
              //tipado acces_token
    return this.http.post<Auth>(`${this.apiUrl}/login`,{email, password});
  }

  getProfile(){
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

}
