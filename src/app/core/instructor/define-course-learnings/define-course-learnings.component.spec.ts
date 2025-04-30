import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineCourseLearningsComponent } from './define-course-learnings.component';

describe('DefineCourseLearningsComponent', () => {
  let component: DefineCourseLearningsComponent;
  let fixture: ComponentFixture<DefineCourseLearningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefineCourseLearningsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefineCourseLearningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
