import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpStatusCode }  from '@angular/common/http';

import { CreateProductDTO, Product, UpdateProductDTO } from './../models/product.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl= `${environment.API_URL}api/products`;

  constructor(
    private http: HttpClient
  ) { }

    getProductsByPage(limit: number, offset: number){
      return this.http.get<Product[]>(this.apiUrl, {
        params: { limit, offset}
      });
    }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: string): Observable<Product> {
                      //<Product[]>tipamos la respuesta array de tipo Product
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === HttpStatusCode.Conflict) {
          return throwError('algo esta fallando en el server')
        }
        if(error.status === HttpStatusCode.NotFound) {
          return throwError('el producto no existe')
        }
        if(error.status === HttpStatusCode.Unauthorized) {
          return throwError('no estas permitido')
        }
        return throwError('ups algo salio mal')
      })
    )
  }
  
  create(dto: CreateProductDTO){
                  //lo que espero que me retorne<Product>
    return this.http.post<Product>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateProductDTO): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  updateProductPATCH(idProduct: number, body: UpdateProductDTO): Observable<Product> {
    return this.http.patch<Product>(this.apiUrl, body);
  }

  delete(id: string){
    return this.http.delete<Product>(`${this.apiUrl}/${id}`)
  }
}