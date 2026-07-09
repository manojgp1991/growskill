import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupperAdminDashboard } from './supper-admin-dashboard';

describe('SupperAdminDashboard', () => {
  let component: SupperAdminDashboard;
  let fixture: ComponentFixture<SupperAdminDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupperAdminDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(SupperAdminDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
