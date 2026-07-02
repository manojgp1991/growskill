import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPipeline } from './add-pipeline';

describe('AddPipeline', () => {
  let component: AddPipeline;
  let fixture: ComponentFixture<AddPipeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPipeline],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPipeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
