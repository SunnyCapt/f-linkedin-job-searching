import { TestBed } from '@angular/core/testing';

import { FlnTypesService } from './fln-types.service';

describe('FlnTypesService', () => {
  let service: FlnTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlnTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
