import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InterestsService } from 'src/app/services/interests.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-menu-items',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-menu-items.component.html',
  styleUrl: './add-menu-items.component.scss'
})
export class AddMenuItemsComponent implements OnInit {

  menuForm: FormGroup;
  menuItems: any[] = [];
  modules: any[] = [];

  constructor(private fb: FormBuilder, private interestService: InterestsService) {
    this.menuForm = this.fb.group({
      menuItemName: ['', Validators.required],
      moduleId: [null, Validators.required],
      icon: [''],
      url: ['']
    });
  }

  ngOnInit(): void {
    this.loadModules();
    this.loadMenuItems();
  }

  addMenuItem() {
    if (this.menuForm.invalid) return;

    this.interestService.addMenuItem(this.menuForm.value).subscribe({
      next: () => {
        Swal.fire('Success', 'Menu item added!', 'success');
        this.menuForm.reset();
        this.loadMenuItems();
      },
      error: () => {
        Swal.fire('Error', 'Failed to add menu item.', 'error');
      }
    });
  }

  loadMenuItems() {
    this.interestService.getMenuItems().subscribe({
      next: (data) => (this.menuItems = data),
      error: () => console.error('Failed to load menu items')
    });
  }

  loadModules() {
    this.interestService.getModules().subscribe({
      next: (data) => (this.modules = data),
      error: () => console.error('Failed to load modules')
    });
  }

  getModuleName(moduleId: number): string {
    const module = this.modules.find(m => m.moduleId === moduleId);
    return module ? module.moduleName : 'Unknown';
  }

  // deleteMenuItem(id: number) {
  //   this.interestService.deleteMenuItem(id).subscribe({
  //     next: () => {
  //       Swal.fire('Deleted', 'Menu item removed', 'success');
  //       this.loadMenuItems();
  //     },
  //     error: () => Swal.fire('Error', 'Failed to delete menu item.', 'error')
  //   });
  // }
}