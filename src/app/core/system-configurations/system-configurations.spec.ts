import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemConfigurations } from './system-configurations';

describe('SystemConfigurations', () => {
  let component: SystemConfigurations;
  let fixture: ComponentFixture<SystemConfigurations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemConfigurations],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemConfigurations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
