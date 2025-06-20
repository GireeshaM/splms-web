import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDisplayPreviewComponent } from './course-display-preview.component';

describe('CourseDisplayPreviewComponent', () => {
  let component: CourseDisplayPreviewComponent;
  let fixture: ComponentFixture<CourseDisplayPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDisplayPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseDisplayPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
