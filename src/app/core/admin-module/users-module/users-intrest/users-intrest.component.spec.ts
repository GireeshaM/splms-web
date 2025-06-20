import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersIntrestComponent } from './users-intrest.component';

describe('UsersIntrestComponent', () => {
  let component: UsersIntrestComponent;
  let fixture: ComponentFixture<UsersIntrestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersIntrestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersIntrestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
