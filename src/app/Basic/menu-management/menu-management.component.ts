import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


interface Module {
  moduleId: number;
  moduleName: string;
  icon: string;
  url: string;
}

interface MenuItem {
  menuId: number;
  menuItemName: string;
  moduleId: number;
  icon: string;
  url: string;
}

interface Role {
  rolesId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface RoleMenuItem {
  roleMenuId: number;
  rolesId: number;
  menuId: number;
}

const MODULE_API = 'https://localhost:7215/api/Modules';
const MENU_API = 'https://localhost:7215/api/MenuItems';


@Component({
  selector: 'app-menu-management',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './menu-management.component.html',
  styleUrl: './menu-management.component.css'
})
export class MenuManagementComponent implements OnInit {
  modules: any[] = [];
  menuItems: any[] = [];
  roles: Role[] = [];
  moduleForm!: FormGroup;
  menuForm!: FormGroup;
  roleMenuForm!:FormGroup;

  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.initForms();
    this.getModules();
    this.getMenuItems();
    this.getRoles();
  }

  initForms(): void {
    this.moduleForm = this.fb.group({
      moduleName: ['', Validators.required],
      icon: ['', Validators.required],
      url: ['', Validators.required],
    });

    this.menuForm = this.fb.group({
      menuItemName: ['', Validators.required],
      moduleId: ['', Validators.required],
      icon: ['', Validators.required],
      url: ['', Validators.required],
    });

    this.roleMenuForm = this.fb.group({
      rolesId: ['', Validators.required],
      menuId: ['', Validators.required],
    });

  }

  getModules() {
    this.api.get<any[]>('https://localhost:7215/api/Modules').subscribe(res => {
      this.modules = res.reverse();
    });
  }

  getMenuItems() {
    this.api.get<any[]>('https://localhost:7215/api/MenuItems').subscribe(res => {
      this.menuItems = res.reverse();
    });
  }

  getRoles() {
    this.api.get<Role[]>('https://localhost:7215/api/Roles').subscribe(res => {
      this.roles = res;
    });
  }

  fillModuleForm(mod: any) {
    this.moduleForm.patchValue({
      moduleName: mod.moduleName,
      icon: mod.icon,
      url: mod.url
    });
  }

  fillMenuForm(item: any) {
    this.menuForm.patchValue({
      menuItemName: item.menuItemName,
      moduleId: item.moduleId,
      icon: item.icon,
      url: item.url
    });
  }

  addModule() {
    if (this.moduleForm.invalid) return;
    const newMod = { moduleId: 0, ...this.moduleForm.value };
    this.api.post('https://localhost:7215/api/Modules', newMod).subscribe(res => {
      this.modules.unshift(res);
      this.toastr.success('Module Added');
      this.moduleForm.reset();
    });
  }

  addMenuItem() {
    if (this.menuForm.invalid) return;
    const newItem = { menuId: 0, ...this.menuForm.value };
    this.api.post('https://localhost:7215/api/MenuItems', newItem).subscribe(res => {
      this.menuItems.unshift(res);
      this.toastr.success('Menu Item Added');
      this.menuForm.reset();
    });
  }

  resetModuleForm() {
    this.moduleForm.reset();
  }

  resetMenuForm() {
    this.menuForm.reset();
  }

  assignRoleMenuItem() {
    if (this.roleMenuForm.invalid) return;

    const newAssignment: RoleMenuItem = {
      roleMenuId: 0,
      ...this.roleMenuForm.value
    };

    this.api.post('https://localhost:7215/api/RoleMenuItems', newAssignment).subscribe(() => {
      this.toastr.success('Menu Item assigned to Role!');
      this.roleMenuForm.reset();
    });
  }
  
}