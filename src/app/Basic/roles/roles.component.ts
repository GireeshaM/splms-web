import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Role } from '../Models';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  newRole: Role = { rolesId: 0, name: '', createdAt: '', updatedAt: '' };
  readonly apiUrl = 'https://localhost:7215/api/Roles';

  constructor(private api: ApiService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.api.get<Role[]>(this.apiUrl).subscribe({
      next: data => this.roles = data,
      error: () => this.toastr.error('Error loading roles')
    });
  }

  addRole() {
    const now = new Date().toISOString();
    const roleData = { ...this.newRole, createdAt: now, updatedAt: now };

    this.api.post<Role>(this.apiUrl, roleData).subscribe({
      next: () => {
        this.newRole.name = '';
        this.loadRoles();
        this.toastr.success('Role added');
      },
      error: () => this.toastr.error('Add failed')
    });
  }

  deleteRole(id: number) {
    this.api.delete(this.apiUrl, id).subscribe({
      next: () => {
        this.loadRoles();
        this.toastr.success('Deleted');
      },
      error: () => this.toastr.error('Delete failed')
    });
  }
}