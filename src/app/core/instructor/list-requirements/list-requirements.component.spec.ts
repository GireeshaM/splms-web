import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRequirementsComponent } from './list-requirements.component';

describe('ListRequirementsComponent', () => {
  let component: ListRequirementsComponent;
  let fixture: ComponentFixture<ListRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRequirementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
