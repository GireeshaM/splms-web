import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMenuItemsComponent } from './add-menu-items.component';

describe('AddMenuItemsComponent', () => {
  let component: AddMenuItemsComponent;
  let fixture: ComponentFixture<AddMenuItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMenuItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMenuItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
