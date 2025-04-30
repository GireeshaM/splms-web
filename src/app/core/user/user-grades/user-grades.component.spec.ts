import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGradesComponent } from './user-grades.component';

describe('UserGradesComponent', () => {
  let component: UserGradesComponent;
  let fixture: ComponentFixture<UserGradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserGradesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
