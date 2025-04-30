import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoleMenuItemsComponent } from './add-role-menu-items.component';

describe('AddRoleMenuItemsComponent', () => {
  let component: AddRoleMenuItemsComponent;
  let fixture: ComponentFixture<AddRoleMenuItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRoleMenuItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRoleMenuItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
