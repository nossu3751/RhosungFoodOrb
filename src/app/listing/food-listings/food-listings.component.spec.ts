import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodListingsComponent } from './food-listings.component';

describe('FoodListingsComponent', () => {
  let component: FoodListingsComponent;
  let fixture: ComponentFixture<FoodListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodListingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
