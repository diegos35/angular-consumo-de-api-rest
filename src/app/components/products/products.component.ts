import { Component, OnInit } from '@angular/core';

import { CreateProductDTO, Product, UpdateProductDTO } from '../../models/product.model';

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
  limit = 10;
  offset = 0;

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.loadMore();
     /* this.productsService.getAllProducts()
    //this.productsService.getProductsByPage(10,0)
    .subscribe(res => {
      this.products = res;
    });  */
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
