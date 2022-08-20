import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Auth } from './../models/auth.model';
import { User } from '../models/user.model';
import { switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl= `${environment.API_URL}api/auth`;

  private profileStore = new BehaviorSubject<User>({} as User);
  profileStore$ = this.profileStore.asObservable();

  constructor(
    private http: HttpClient,
    private token: TokenService
  ) { }


  login(email:string, password:string){
              //tipado acces_token
    return this.http.post<Auth>(`${this.apiUrl}/login`,{email, password})
    .pipe(
      tap(response => this.token.saveToken(response.access_token)) 
    );
  }

  getProfile(): Observable<User>{
    /* const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    }); */
    return this.http.get<User>(`${this.apiUrl}/profile`);
  } 
  

  loginAndGet(email: string, password: string) {
    return this.login(email, password)
    .pipe(
      switchMap(()=> this.getProfile()),
    )
  }

  setCurrentProfile(user: User) {
    this.profileStore.next(user);
    return this.profileStore$;
  }
  

} 
