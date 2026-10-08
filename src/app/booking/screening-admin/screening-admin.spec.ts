import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ScreeningAdmin } from './screening-admin';

describe('ScreeningAdmin', () => {
  let component: ScreeningAdmin;
  let fixture: ComponentFixture<ScreeningAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreeningAdmin],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreeningAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
