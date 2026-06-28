import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSubscriptions } from './add-new-subscriptions';

describe('AddNewSubscriptions', () => {
  let component: AddNewSubscriptions;
  let fixture: ComponentFixture<AddNewSubscriptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewSubscriptions],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewSubscriptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
