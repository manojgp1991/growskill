import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmailTemplate } from './new-email-template';

describe('NewEmailTemplate', () => {
  let component: NewEmailTemplate;
  let fixture: ComponentFixture<NewEmailTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEmailTemplate],
    }).compileComponents();

    fixture = TestBed.createComponent(NewEmailTemplate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
