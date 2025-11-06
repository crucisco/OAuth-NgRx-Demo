import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { UserProfile } from '../models/userProfile';
import { UserFacade } from '../state/user/user.facade';
import { Status } from '../models/status';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockProfileFacade: jasmine.SpyObj<UserFacade>;

  beforeEach(async () => {
    mockProfileFacade = jasmine.createSpyObj('ProfileFacade', ['loadProfile'], {
      profile$: of(undefined)
    });

    ({ fixture, component } = await InitialiseComponent(mockProfileFacade));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize profile$ with undefined from facade', () => {
    (component as any).profile$.subscribe((profile: UserProfile) => {
      expect(profile).toBeUndefined();
    });

    let search = fixture.nativeElement.querySelector('div').textContent.includes('No profile data available');
    expect(search).toBeTrue();

    search = fixture.nativeElement.querySelector('div').textContent.includes('Email');
    expect(search).toBeFalse();

    search = fixture.nativeElement.querySelector('div').textContent.includes('Error getting profile data');
    expect(search).toBeFalse();
  });

  it('should call loadProfile on ngOnInit', () => {
    component.ngOnInit();
    expect(mockProfileFacade.loadProfile).toHaveBeenCalled();
  });

  // !IMPORTANT! We can't test the component reacting to changes in the facade's observable
  // So the only way to test this is to recreate the component with a different mock observable
  // which is not ideal but demonstrates the concept
    it('should initialise loading$ with value from facade', async () => {
    mockProfileFacade = jasmine.createSpyObj('ProfileFacade', ['loadProfile'], {
      dataLoading$: of(Status.Loading)
    });

    await TestBed.resetTestingModule();
    ({ fixture, component } = await InitialiseComponent(mockProfileFacade));

    (component as any).loading$.subscribe((profile: UserProfile) => {
      expect(profile).toBeTruthy();
      expect(profile).toEqual(profile);
    });

    let search = fixture.nativeElement.querySelector('div').textContent.includes('Loading profile...');
    expect(search).toBeTrue();
  });

  it('should initialise profile$ with value from facade', async () => {
    const profile: UserProfile = { id: '1', givenName: 'Test', userPrincipalName: 'test@test.com' };
    mockProfileFacade = jasmine.createSpyObj('ProfileFacade', ['loadProfile'], {
      profile$: of(profile)
    });

    await TestBed.resetTestingModule();
    ({ fixture, component } = await InitialiseComponent(mockProfileFacade));

    (component as any).profile$.subscribe((profile: UserProfile) => {
      expect(profile).toBeTruthy();
      expect(profile).toEqual(profile);
    });

    let search = fixture.nativeElement.querySelector('div').textContent.includes(profile.userPrincipalName);
    expect(search).toBeTrue();
  });

  it('should initialise error$ with value from facade', async () => {
    const errorMsg = 'There has been a catastrophe!';
    mockProfileFacade = jasmine.createSpyObj('ProfileFacade', ['loadProfile'], {
      dataError$: of(errorMsg)
    });

    await TestBed.resetTestingModule();
    ({ fixture, component } = await InitialiseComponent(mockProfileFacade));

    (component as any).error$.subscribe((error: string) => {
      expect(error).toBeTruthy();
      expect(error).toEqual(errorMsg);

    });

    let search = fixture.nativeElement.querySelector('div').textContent.includes(errorMsg);
    expect(search).toBeTrue();
  });
});

async function InitialiseComponent(
  mockProfileFacade: jasmine.SpyObj<UserFacade>): Promise<{ fixture: ComponentFixture<ProfileComponent>, component: ProfileComponent }> {
  await TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      { provide: UserFacade, useValue: mockProfileFacade }
    ],
    imports: [ProfileComponent]
  })
    .compileComponents();

  let fixture = TestBed.createComponent(ProfileComponent);
  let component = fixture.componentInstance;
  await fixture.whenStable();
  return { fixture, component };
}

