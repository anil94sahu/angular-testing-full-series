import {async, getTestBed, TestBed} from '@angular/core/testing';

import { ProductService } from './product.service';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/firestore';
import {FileService} from '../../files/shared/file.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Observable, of} from 'rxjs';

describe('ProductService', () => {
  let angularFirestoreMock: any;
  let fileServiceMock: any;
  let fsCollection: any;
  let httpMock: HttpTestingController;
  let service: ProductService;
  beforeEach(() => {
    angularFirestoreMock = jasmine.createSpyObj('AngularFirestore', ['collection']);
    // fsCollection = jasmine.createSpyObj('AngularFirestoreCollection', ['snapshotChanges'])
    // angularFirestoreMock.collection.and.returnValue(fsCollection);
    fileServiceMock = jasmine.createSpyObj('FileService', ['getFileUrl', 'upload'])
    TestBed.configureTestingModule({
      imports: [
        AngularFirestoreModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: AngularFirestore, useValue: angularFirestoreMock},
        {provide: FileService, useValue: fileServiceMock}

      ]
    });
    service = TestBed.get(ProductService);
    httpMock = getTestBed().get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProductsCalls', () => {
    beforeEach(() => {
      service.getProducts();
    })
    it('should call collection and snapshot changes on angularfitrestore', () => {
      expect(angularFirestoreMock.collection).toHaveBeenCalledTimes(1);
    })
    /* it('should call collection 1 time on AngularFirestore service', () => {
   
    });

    it('should call collection with "products" as param', () => {
    });

    it('should call snapshotChanges 1 time on AngularFirestore service', () => {
      // expect(fsCollectionMock.snapshotChanges).toHaveBeenCalledTimes(1);
    }); */
  });
});
