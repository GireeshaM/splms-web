import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveTrainingComponent } from './live-training.component';

describe('LiveTrainingComponent', () => {
  let component: LiveTrainingComponent;
  let fixture: ComponentFixture<LiveTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveTrainingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
