import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupperAdminLogin } from './supper-admin-login';

describe('SupperAdminLogin', () => {
  let component: SupperAdminLogin;
  let fixture: ComponentFixture<SupperAdminLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupperAdminLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(SupperAdminLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
