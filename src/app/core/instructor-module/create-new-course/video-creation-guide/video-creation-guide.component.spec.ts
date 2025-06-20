import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCreationGuideComponent } from './video-creation-guide.component';

describe('VideoCreationGuideComponent', () => {
  let component: VideoCreationGuideComponent;
  let fixture: ComponentFixture<VideoCreationGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCreationGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCreationGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
