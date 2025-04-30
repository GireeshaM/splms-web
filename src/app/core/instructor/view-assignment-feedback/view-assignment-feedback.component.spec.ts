import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssignmentFeedbackComponent } from './view-assignment-feedback.component';

describe('ViewAssignmentFeedbackComponent', () => {
  let component: ViewAssignmentFeedbackComponent;
  let fixture: ComponentFixture<ViewAssignmentFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAssignmentFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssignmentFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
