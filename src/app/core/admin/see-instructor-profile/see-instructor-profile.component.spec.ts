import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeInstructorProfileComponent } from './see-instructor-profile.component';

describe('SeeInstructorProfileComponent', () => {
  let component: SeeInstructorProfileComponent;
  let fixture: ComponentFixture<SeeInstructorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeInstructorProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeInstructorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
