import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InterestsService } from 'src/app/services/interests.service';
import Swal from 'sweetalert2';
interface RoleForm {
  id: number;
  name: string;
  createdAt:Date;
  updatedAt:Date;
}
@Component({
  selector: 'app-add-role',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.scss'
})

export class AddRoleComponent {
  roleForm: FormGroup;
  submitted = false;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private interestService: InterestsService) {
    this.roleForm = this.fb.nonNullable.group({
      name: ['', Validators.required]
    });
  }
  

  onSubmit() {
    this.submitted = true;
  
    if (this.roleForm.invalid) return;
  
    this.interestService.addRole(this.roleForm.value).subscribe({
      next: (res) => {
        this.successMsg = 'Role added successfully!';
        Swal.fire({
          title: 'Success!',
          text: this.successMsg,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.roleForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        this.errorMsg = 'Failed to add role. Try again.';
        Swal.fire({
          title: 'Error!',
          text: this.errorMsg,
          icon: 'error',
          confirmButtonText: 'Close'
        });
        console.error(err);
      }
    });
  }
  
}