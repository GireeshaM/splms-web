import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTrendsComponent } from './top-trends.component';

describe('TopTrendsComponent', () => {
  let component: TopTrendsComponent;
  let fixture: ComponentFixture<TopTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopTrendsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
