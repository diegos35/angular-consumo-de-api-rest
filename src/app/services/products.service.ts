import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode }  from '@angular/common/http';

import { CreateProductDTO, Product, UpdateProductDTO } from './../models/product.model';
import { Observable, throwError, zip } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
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

  getAllProducts(limit?: number, offset?: number): Observable<Product[]> {
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', limit);
    }
    return this.http.get<Product[]>(this.apiUrl, { params })
    .pipe(
      //retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes: .19 * item.price
        }
      }))
    );
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

  fetchReadAndpdate(id: string, dto: UpdateProductDTO){
    return zip(
      this.getProduct(id),
      this.update(id, dto),
    );
  }
}