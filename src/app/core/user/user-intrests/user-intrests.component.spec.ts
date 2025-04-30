import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIntrestsComponent } from './user-intrests.component';

describe('UserIntrestsComponent', () => {
  let component: UserIntrestsComponent;
  let fixture: ComponentFixture<UserIntrestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserIntrestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserIntrestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
