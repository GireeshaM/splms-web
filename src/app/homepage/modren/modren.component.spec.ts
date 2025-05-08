import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModrenComponent } from './modren.component';

describe('ModrenComponent', () => {
  let component: ModrenComponent;
  let fixture: ComponentFixture<ModrenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModrenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
