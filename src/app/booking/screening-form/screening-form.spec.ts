import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreeningForm } from './screening-form';

describe('ScreeningForm', () => {
  let component: ScreeningForm;
  let fixture: ComponentFixture<ScreeningForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreeningForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreeningForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
