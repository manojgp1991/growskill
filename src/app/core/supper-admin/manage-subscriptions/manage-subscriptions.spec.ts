import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSubscriptions } from './manage-subscriptions';

describe('ManageSubscriptions', () => {
  let component: ManageSubscriptions;
  let fixture: ComponentFixture<ManageSubscriptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSubscriptions],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageSubscriptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
