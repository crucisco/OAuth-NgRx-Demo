import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { UserFacade } from '../state/user/user.facade';
import { provideMockStore } from '@ngrx/store/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockUserFacade: jasmine.SpyObj<UserFacade>;

  beforeEach(async () => {
    mockUserFacade = jasmine.createSpyObj('UserFacade', ['checkIsAuthenticated', 'login'], {
      accountInfo$: of(undefined)
    });

    ({ fixture, component } = await InitialiseComponent(mockUserFacade));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login method on link click', async () => {
    mockUserFacade = jasmine.createSpyObj('UserFacade', ['checkIsAuthenticated', 'login'], {
      accountInfo$: of(undefined)
    });

    TestBed.resetTestingModule();
    ({ fixture, component } = await InitialiseComponent(mockUserFacade));

    mockUserFacade.accountInfo$.subscribe(ai => {
      expect(!!ai).toBeFalse();
    })

    const link = fixture.nativeElement.querySelector('a#loginLink');
    link.click();

    expect(mockUserFacade.login).toHaveBeenCalledTimes(1);
  });

  it('should render Welcome message if authenticated', async () => {
    mockUserFacade = jasmine.createSpyObj('UserFacade', ['checkIsAuthenticated', 'login', 'logout'], {
      accountInfo$: of({ idToken: 'Test user token' })
    });

    TestBed.resetTestingModule();
    ({ fixture, component } = await InitialiseComponent(mockUserFacade));

    mockUserFacade.accountInfo$.subscribe(ai => {
      expect(!!ai).toBeTrue();
    })

    expect (fixture.nativeElement.querySelector('p').textContent).toContain('Welcome back');
  });
});

async function InitialiseComponent(mockUserFacade: jasmine.SpyObj<UserFacade>): Promise<{ fixture: ComponentFixture<HomeComponent>, component: HomeComponent }> {
  await TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      provideMockStore(),
      { provide: UserFacade, useValue: mockUserFacade },
    ],
    imports: [HomeComponent]
  })
    .compileComponents();

  let fixture = TestBed.createComponent(HomeComponent);
  let component = fixture.componentInstance;
  await fixture.whenStable();
  return { fixture, component };
}

