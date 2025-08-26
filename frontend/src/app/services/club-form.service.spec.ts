import { TestBed } from '@angular/core/testing';

import { ClubFormService } from './club-form.service';

describe('ClubFormService', () => {
  let service: ClubFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClubFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
