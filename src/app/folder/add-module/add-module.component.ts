import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InterestsService } from 'src/app/services/interests.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-module',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-module.component.html',
  styleUrl: './add-module.component.scss'
})
export class AddModuleComponent {

  moduleForm: FormGroup;
  modules: any[] = [];

  constructor(private fb: FormBuilder, private interestService: InterestsService) {
    this.moduleForm = this.fb.group({
      moduleName: ['', Validators.required],
      icon: [''],
      url: [''],
      status: [true]
    });
  }

  ngOnInit(): void {
    this.loadModules();
  }

  addModule() {
    if (this.moduleForm.invalid) return;

    this.interestService.addModule(this.moduleForm.value).subscribe({
      next: () => {
        Swal.fire('Success', 'Module added successfully!', 'success');
        this.moduleForm.reset({ status: true });
        this.loadModules();
      },
      error: () => {
        Swal.fire('Error', 'Failed to add module.', 'error');
      }
    });
  }

  loadModules() {
    this.interestService.getModules().subscribe({
      next: (data) => (this.modules = data),
      error: () => console.error('Failed to load modules')
    });
  }

  // deleteModule(id: number) {
  //   this.interestService.deleteModule(id).subscribe({
  //     next: () => {
  //       Swal.fire('Deleted', 'Module removed', 'success');
  //       this.loadModules();
  //     },
  //     error: () => Swal.fire('Error', 'Failed to delete module.', 'error')
  //   });
  // }
}