import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCourseDisplayComponent } from './user-course-display.component';

describe('UserCourseDisplayComponent', () => {
  let component: UserCourseDisplayComponent;
  let fixture: ComponentFixture<UserCourseDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCourseDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCourseDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
