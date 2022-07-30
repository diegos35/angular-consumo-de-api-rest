import { Component, OnInit } from '@angular/core';

import { CreateProductDTO, Product } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  //productChosen: Product = { } as Product;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: ''
    },
    description: ''
  };

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getAllProducts()
    .subscribe(res => {
      this.products = res;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail(){
    this.showProductDetail = !this.showProductDetail;
  } 

  onShowDetail(id: string){
    this.productsService.getProduct(id)
    .subscribe(data => {
      console.log(data)
      this.toggleProductDetail();
      this.productChosen = data;
    });
  }
  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'New Product',
      description: 'New Product Description',
      images: ['https://placeimg.com/640/480/any'],
      price: 1000,
      categoryId:2 
    }
    this.productsService.create(product)
    .subscribe(data => {
      this.products.unshift(data);
      console.log(data);
    });
  }
}
