import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFinalAssessmentComponent } from './add-final-assessment.component';

describe('AddFinalAssessmentComponent', () => {
  let component: AddFinalAssessmentComponent;
  let fixture: ComponentFixture<AddFinalAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFinalAssessmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFinalAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
