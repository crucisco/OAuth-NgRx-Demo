import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from "@angular/core/testing";
import { App } from "./app";
import { provideZonelessChangeDetection } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WindowsService } from "./services/windows.service";
import { provideMockStore } from "@ngrx/store/testing";

describe('AppComponent', () => {
  let fixture: ComponentFixture<App>;
  let component: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: ActivatedRoute, useValue: { snapshot: { data: {} } } },
        WindowsService,
        provideMockStore(),
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
      imports: [App]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect((component as any).title).toBe('OAuth NgRx Demo');
  });
});
