import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeUserInsightsComponent } from './see-user-insights.component';

describe('SeeUserInsightsComponent', () => {
  let component: SeeUserInsightsComponent;
  let fixture: ComponentFixture<SeeUserInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeUserInsightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeUserInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
