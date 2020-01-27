import { ComponentFixture } from "@angular/core/testing";

import { ProductsListComponent } from "../products/products-list/products-list.component";
import { By } from '@angular/platform-browser';


class DOMHelper<T> {
    fixture: ComponentFixture<T>;
    constructor(fixture: ComponentFixture<T>) {
      this.fixture = fixture;
    }
  
    singleText(tagName: string): string{
      const h2Ele = this.fixture.debugElement.query(By.css(tagName))
      if(h2Ele){
        return h2Ele.nativeElement.textContent;
      }
    }
  
    count(tagName: string): number {
      const element = this.fixture.debugElement.queryAll(By.css(tagName))
      return element.length;
    }
  
    countText(tagName: string, text:string): number {
      let elements = this.fixture.debugElement.queryAll(By.css(tagName));
      return elements.filter(element => element.nativeElement.textContent === text).length;
    }
  }