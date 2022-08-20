import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = this.addToken(request); //sobrescribir
    return next.handle(request);
  }

  private addToken(request: HttpRequest<unknown>){
    const token = this.tokenService.getToken();
    if(token){
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + token
      });
      const authReq = request.clone({//clonamos la peticion si existe un token
        headers: headers
      }) 
      return authReq 
    }
    return request
  }
}
