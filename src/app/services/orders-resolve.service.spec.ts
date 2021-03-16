import { TestBed } from '@angular/core/testing';

import { OrdersResolveService } from './orders-resolve.service';

describe('OrdersResolveService', () => {
  let service: OrdersResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersResolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
