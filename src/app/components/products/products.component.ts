import { Component, OnInit } from '@angular/core';

import { CreateProductDTO, Product, UpdateProductDTO } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';
import { switchMap } from 'rxjs/operators'; //(depende una de otra)para evitar el callback hell
import { zip } from 'rxjs'; //(en paralelo)nos permite enviar adjuntar dos observadores y recibir la res al tiempo


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
  limit = 10;
  offset = 0;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    //this.loadMore(); 
     this.productsService.getAllProducts(10, 0)
    //this.productsService.getProductsByPage(10,0)
    .subscribe(res => {
      this.products = res;
      this.offset += this.limit;
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
    this.statusDetail = 'loading';   
    this.productsService.getProduct(id)
    .subscribe(data => {
      console.log(data)
      this.toggleProductDetail();
      this.productChosen = data;
      this.statusDetail = 'success'; 
    },response => {
      console.error(response);
      this.statusDetail = 'error';
    });
  }

  readAnUpdate(id: string){
    this.productsService.getProduct(id)
    .pipe(
      switchMap((product) => this.productsService.update(product.id, {title: 'change'})),
      /* switchMap((product) => this.productsService.update(product.id, {title: 'change'})),*/
    ).subscribe(data => {
      console.log(data);
    })
    this.productsService.fetchReadAndpdate(id, {title: 'new'})
    .subscribe(response => {
      const read = response[0]
      const updated = response[1]
    })
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

  updateProduct(){
    const changes: UpdateProductDTO = {
    title: 'updated dieg'
    };
    const id = this.productChosen.id;
    this.productsService.update(id, changes)
    .subscribe(data => {
      const productIndex = this.products.findIndex(
        item =>item.id ==this.productChosen.id
      );
      console.log(productIndex, data);
      this.products[productIndex] = data; //Product carts
      this.productChosen = data; //slide
    });
  }

  deleteProduct(idProduct: any) {
    // const id = this.productChosen.id;
    const id = idProduct;
    this.productsService.delete(id)
    .subscribe(() =>{
      const producIndex = this.products
        .findIndex(item => item.id === this.productChosen.id )
      this.products.splice(producIndex, 1);
      this.showProductDetail = false;
    });
  }

  loadMore() {
    this.productsService.getProductsByPage(this.limit,this.offset)
    .subscribe(data => {
      /* this.products = this.products.concat(data); */ //es lo mismo de abajo
      this.products = [... this.products, ...data]
      this.offset += this.limit;
    }); 
  }
}
