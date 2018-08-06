import { TestBed, inject } from '@angular/core/testing';

import { IzdatkiService } from './izdatki.service';

describe('IzdatkiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IzdatkiService]
    });
  });

  it('should be created', inject([IzdatkiService], (service: IzdatkiService) => {
    expect(service).toBeTruthy();
  }));
});
