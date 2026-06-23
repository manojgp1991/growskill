import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactPopup } from './add-contact-popup';

describe('AddContactPopup', () => {
  let component: AddContactPopup;
  let fixture: ComponentFixture<AddContactPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContactPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(AddContactPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
