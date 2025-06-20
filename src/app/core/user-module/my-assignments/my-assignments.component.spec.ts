import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAssignmentsComponent } from './my-assignments.component';

describe('MyAssignmentsComponent', () => {
  let component: MyAssignmentsComponent;
  let fixture: ComponentFixture<MyAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAssignmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
