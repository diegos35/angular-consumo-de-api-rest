import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CreateProductDTO, Product, UpdateProductDTO } from './../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl= 'https://young-sands-07814.herokuapp.com/api/products';

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