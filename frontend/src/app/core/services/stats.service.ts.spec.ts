import { TestBed } from '@angular/core/testing';

import { StatsServiceTs } from './stats.service.ts';

describe('StatsServiceTs', () => {
  let service: StatsServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatsServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
