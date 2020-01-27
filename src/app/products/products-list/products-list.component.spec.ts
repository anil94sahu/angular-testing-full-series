import { FileService } from './../../files/shared/file.service';
import { ProductService } from './../shared/product.service';
import { DOMHelper } from './../../../testing/dom-helper';
import { element } from 'protractor';
import { Product } from './../shared/product.model';
import { ProductAddComponent } from './../product-add/product-add.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { ProductsListComponent } from './products-list.component';
import {Observable, of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let dh: DOMHelper<ProductsListComponent>;
  let productServiceMock: any;
  let fileServiceMock: any;
  let helper: Helper;
  beforeEach(async(() => {
    productServiceMock = jasmine.createSpyObj('ProductService', ['getProducts'])
    fileServiceMock = jasmine.createSpyObj('FileService', ['getFileUrl'])
    productServiceMock.getProducts.and.returnValue(of([]));
    fileServiceMock.getFileUrl.and.returnValue('');
    TestBed.configureTestingModule({
      declarations: [
        ProductsListComponent,
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        {provide: ProductService, useValue: productServiceMock},
        {provide: FileService, useValue: fileServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    helper = new Helper();
    dh = new DOMHelper(fixture);
    fixture.detectChanges();
  });

  describe('Simple HTML', () => {
    it('expectation of h1 tag', () => {
      // const h2Ele = fixture.debugElement.query(By.css('h2'))
      expect(dh.singleText('h2')).toBe('List all Products')
    });
  
    it('expectation of button should have + sign tag', () => {
      // const buttons = fixture.debugElement.queryAll(By.css('button'))
      expect(dh.count('button')).toBeGreaterThanOrEqual(1);
    });
  
    it('expectation of button should have + sign tag is first button', () => {
      // const linkDes = fixture.debugElement.queryAll(By.css('button'))
      // const nativeButton : HTMLButtonElement = linkDes[0].nativeElement;
      expect(dh.singleText('button')).toBe('+');
    });
  
    it('expecation should navigate to / before + button click', () =>{
      const location = TestBed.get(Location);
      expect(location.path()).toBe('');
    })

  })
  // simple hmtl

  describe('navigation test', () => {
    let location:Location;
    let router: Router;
    beforeEach(() => {
      location = TestBed.get(Location);
      router = TestBed.get(Router);
    });
    it('expecation should navigate to / before + button click navigate to routing changes', () =>{
    
      spyOn(router, 'navigateByUrl' );
      dh.clickButton('+');
      expect(router.navigateByUrl).toHaveBeenCalledWith(router.createUrlTree(['/add'],
      ),{ skipLocationChange: false, replaceUrl:false } );
      /* const location = TestBed.get(Location);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(location.path()).toBe('/add')
      }) */
    });

  })

  describe('Unordered list test', () => {
    it('expecation should be only 1 unorder list', () =>{
      // const unorderedList = fixture.debugElement.queryAll(By.css('ul'));
      expect(dh.count('ul')).toBe(1); 
    });
  
    it('expecation should be only 0 list item', () =>{
      const listItem = fixture.debugElement.queryAll(By.css('li'));
      expect(dh.count('li')).toBe(0); 
    })
  
    it('expecation should be only 1 list item', () =>{
      component.products = helper.getProducts(1);
      fixture.detectChanges();
      // const listItem = fixture.debugElement.queryAll(By.css('li'));
      expect(dh.count('li')).toBe(1); 
    })

  })
  // navigation
  describe('Data test', () => {

    it('expecation should be only 100 list item if availabe', () =>{
      component.products = helper.getProducts(100);
      fixture.detectChanges();
      const listItem = fixture.debugElement.queryAll(By.css('li'));
      expect(dh.count('li')).toBe(100); 
    })
  
    it('expecation should be only 100 delete list item if availabe', () => {
      component.products = helper.getProducts(100);
      fixture.detectChanges();
     /*  let listItem = fixture.debugElement.queryAll(By.css('button'));
      listItem = listItem.slice(1, listItem.length); */
      expect(dh.countText('button','Delete' )).toBe(100);
    })
    it('expecation span item should be same as product name', () => {
      component.products = helper.getProducts(1);
      fixture.detectChanges();
      const spanItems = fixture.debugElement.queryAll(By.css('span'));
      expect(spanItems.length).toBe(1);
      const span = spanItems[0];
      const spanElement: HTMLSpanElement = span.nativeElement;
      expect(spanElement.textContent).toBe(
        helper.products[0].name + ' -- ' +  helper.products[0].id
      );
    })
  
    it('expecation should call the delete once', () => {
      component.products = helper.getProducts(1);
      fixture.detectChanges();
      spyOn(component, 'deleteProduct');
      dh.clickButton('Delete');
      expect(component.deleteProduct).toHaveBeenCalledWith(helper.products[0]);
      expect(component.deleteProduct).toHaveBeenCalledTimes(1);
      
    })
  
    it('expecation should call the delete product when click on delete button', () => {
      component.products = helper.getProducts(1);
      fixture.detectChanges();
      spyOn(component, 'deleteProduct');
      dh.clickButton('Delete');
      expect(component.deleteProduct).toHaveBeenCalledWith(helper.products[0]);
      expect(component.deleteProduct).toHaveBeenCalledTimes(1);
      
    })

  })

  describe('Async call test', () => {
    let helper: Helper;
    beforeEach(() => {
      helper = new Helper();
    });
    it('without on init', () =>{
      fixture.detectChanges();
      expect(productServiceMock.getProducts).toHaveBeenCalledTimes(1);
    })
    it('should show img tag when product with url is loaded', () => {
      productServiceMock.getProducts.and.returnValue(helper.getProducts(1));
      helper.products[0].pictureId = undefined;
      fileServiceMock.getFileUrl.and.returnValue(of('http://ksgf'));
      fixture.detectChanges();
      expect(dh.count('img')).toBe(0)
    })
  
  })
  

});

class  Helper {
  products : Product[] = [];
  getProducts(amount:number) : Observable<Product[]>{
    for (let i = 0; i < amount; i++) {
      this.products.push({id:'abc'+i , name: 'item '+ i, pictureId:  'def' })    
    }
    return of(this.products)
  }
}

