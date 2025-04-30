import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeUserReviewsComponent } from './see-user-reviews.component';

describe('SeeUserReviewsComponent', () => {
  let component: SeeUserReviewsComponent;
  let fixture: ComponentFixture<SeeUserReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeUserReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeUserReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
