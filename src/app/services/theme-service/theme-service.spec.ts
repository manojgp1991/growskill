import { TestBed } from '@angular/core/testing';

import { ThemeCssService } from './theme-service';

describe('ThemeService', () => {
  let service: ThemeCssService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeCssService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
