import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomereviewsComponent } from './homereviews.component';

describe('HomereviewsComponent', () => {
  let component: HomereviewsComponent;
  let fixture: ComponentFixture<HomereviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomereviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomereviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
