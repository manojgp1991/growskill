import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupperAdminSidePannel } from './supper-admin-side-pannel';

describe('SupperAdminSidePannel', () => {
  let component: SupperAdminSidePannel;
  let fixture: ComponentFixture<SupperAdminSidePannel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupperAdminSidePannel],
    }).compileComponents();

    fixture = TestBed.createComponent(SupperAdminSidePannel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
