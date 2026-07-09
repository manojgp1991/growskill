import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupperAdminFooter } from './supper-admin-footer';

describe('SupperAdminFooter', () => {
  let component: SupperAdminFooter;
  let fixture: ComponentFixture<SupperAdminFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupperAdminFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(SupperAdminFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
