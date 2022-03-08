import { TestBed } from '@angular/core/testing';

import { AvatarStateService } from './avatar-state.service';

describe('AvatarStateService', () => {
  let service: AvatarStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
