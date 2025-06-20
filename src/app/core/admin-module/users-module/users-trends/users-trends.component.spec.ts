import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTrendsComponent } from './users-trends.component';

describe('UsersTrendsComponent', () => {
  let component: UsersTrendsComponent;
  let fixture: ComponentFixture<UsersTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersTrendsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
