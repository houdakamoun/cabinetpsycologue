import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePsy } from './profile-psy';

describe('ProfilePsy', () => {
  let component: ProfilePsy;
  let fixture: ComponentFixture<ProfilePsy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePsy],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePsy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
