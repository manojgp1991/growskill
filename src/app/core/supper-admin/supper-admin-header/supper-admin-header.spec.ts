import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupperAdminHeader } from './supper-admin-header';

describe('SupperAdminHeader', () => {
  let component: SupperAdminHeader;
  let fixture: ComponentFixture<SupperAdminHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupperAdminHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(SupperAdminHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
