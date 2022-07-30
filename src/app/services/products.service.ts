import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CreateProductDTO, Product } from './../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl= 'https://young-sands-07814.herokuapp.com/api/products';

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
  }
  
  create(dto: CreateProductDTO){
                  //lo que espero que me retorne<Product>
    return this.http.post<Product>(this.apiUrl, dto);
  }
}