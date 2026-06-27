import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewUserPopup } from './add-new-user-popup';

describe('AddNewUserPopup', () => {
  let component: AddNewUserPopup;
  let fixture: ComponentFixture<AddNewUserPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewUserPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewUserPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
