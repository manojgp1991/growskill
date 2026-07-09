import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupperAdminLayout } from './supper-admin-layout';

describe('SupperAdminLayout', () => {
  let component: SupperAdminLayout;
  let fixture: ComponentFixture<SupperAdminLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupperAdminLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(SupperAdminLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
