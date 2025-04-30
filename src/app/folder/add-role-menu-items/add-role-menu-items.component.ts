import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InterestsService } from 'src/app/services/interests.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-role-menu-items',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-role-menu-items.component.html',
  styleUrl: './add-role-menu-items.component.scss'
})
export class AddRoleMenuItemsComponent {
  roleMenuForm: FormGroup;
  roles: any[] = [];
  menuItems: any[] = [];
  roleMenuItems: any[] = [];
  constructor(private fb: FormBuilder, private interestService: InterestsService) {
    this.roleMenuForm = this.fb.group({
      roleId: [null, Validators.required],  // Default to null
      menuId: [null, Validators.required]
    });
  }
  ngOnInit(): void {
    this.loadRoles();
    this.loadMenuItems();
    this.loadRoleMenuItems();

    console.log('Initial Form Value:', this.roleMenuForm.value);
  }
  initializeForm() {
    this.roleMenuForm = this.fb.group({
      roleId: [null, Validators.required],  // Default null
      menuId: [null, Validators.required]   // Default null
    });
  }
  addRoleMenuItem() {
    console.log('Form Value before submission:', this.roleMenuForm.value); // Log to check if roleId is selected
    if (this.roleMenuForm.invalid) {
      console.warn('Form Invalid:', this.roleMenuForm.value);
      return;
    }
    const { roleId, menuId } = this.roleMenuForm.value;
    console.log('🔍 Selected Role ID:', roleId); // Check if roleId is being set here
    console.log('🚀 Payload being sent to API:', { roleId, menuId });
    this.interestService.addRoleMenuItem({ roleId, menuId }).subscribe({
      next: () => {
        Swal.fire('Success', 'Menu item assigned to role!', 'success');
        this.roleMenuForm.reset();
        this.loadRoleMenuItems();
      },
      error: (err) => {
        console.error('🔥 API Error:', err.error);
        Swal.fire('Error', 'Assignment failed.', 'error');
      }
    });
  }
  loadRoles() {
    this.interestService.getRoles().subscribe(res => {
      this.roles = res;

      console.log('🔍 Loaded roles:', this.roles); // Log roles to check the data
      if (this.roles && this.roles.length > 0) {
        this.initializeForm();
      this.roleMenuForm.patchValue({ roleId: this.roles[0]?.roleId || null });
// Initialize form only if roles are loaded
      } else {
        console.warn('No roles available!');
      }
    });
  }
  loadMenuItems() {
    this.interestService.getMenuItems().subscribe(res => this.menuItems = res);
  }
  loadRoleMenuItems() {
    this.interestService.getRoleMenuItems().subscribe(res => this.roleMenuItems = res);
  }
  getRoleName(roleId: number) {
    return this.roles.find(r => r.rolesId === roleId)?.name || 'Unknown';
  }
  getMenuName(menuId: number) {
    return this.menuItems.find(m => m.menuId === menuId)?.menuItemName || 'Unknown';
  }
}