import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineLearningsComponent } from './define-learnings.component';

describe('DefineLearningsComponent', () => {
  let component: DefineLearningsComponent;
  let fixture: ComponentFixture<DefineLearningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefineLearningsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefineLearningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
