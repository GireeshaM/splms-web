import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeInstructorReviewsComponent } from './see-instructor-reviews.component';

describe('SeeInstructorReviewsComponent', () => {
  let component: SeeInstructorReviewsComponent;
  let fixture: ComponentFixture<SeeInstructorReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeInstructorReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeInstructorReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
