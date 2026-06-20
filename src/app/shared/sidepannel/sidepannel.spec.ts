import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidepannel } from './sidepannel';

describe('Sidepannel', () => {
  let component: Sidepannel;
  let fixture: ComponentFixture<Sidepannel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidepannel],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidepannel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
