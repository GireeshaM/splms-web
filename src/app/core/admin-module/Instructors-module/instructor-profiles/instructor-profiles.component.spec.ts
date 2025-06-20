import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorProfilesComponent } from './instructor-profiles.component';

describe('InstructorProfilesComponent', () => {
  let component: InstructorProfilesComponent;
  let fixture: ComponentFixture<InstructorProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorProfilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
