import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEnrolledCoursesComponent } from './my-enrolled-courses.component';

describe('MyEnrolledCoursesComponent', () => {
  let component: MyEnrolledCoursesComponent;
  let fixture: ComponentFixture<MyEnrolledCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEnrolledCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyEnrolledCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
