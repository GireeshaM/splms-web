import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InterestsService } from 'src/app/services/interests.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-category',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {

  categoryForm: FormGroup;
  subCategoryForm: FormGroup;
  categories: any[] = [];
  subcategories: any[] = [];
  constructor(private fb: FormBuilder, private interestService: InterestsService) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.subCategoryForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadSubcategories();
  }

  loadCategories() {
    this.interestService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  addCategory() {
    if (this.categoryForm.invalid) return;

    const newCategory = {
      name: this.categoryForm.value.name,
      createdAt: new Date()
    };

    this.interestService.addCategory(newCategory).subscribe({
      next: () => {
        Swal.fire('Success', 'Category added!', 'success');
        this.categoryForm.reset();
        this.loadCategories();
      },
      error: () => Swal.fire('Error', 'Failed to add category.', 'error')
    });
  }
  loadSubcategories() {
    this.interestService.getSubcategories().subscribe({
      next: (data) => this.subcategories = data,
      error: (err) => console.error('Failed to load subcategories', err)
    });
  }
  addSubCategory() {
    if (this.subCategoryForm.invalid) return;

    const newSub = {
      name: this.subCategoryForm.value.name,
      categoryId: this.subCategoryForm.value.categoryId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.interestService.addSubCategory(newSub).subscribe({
      next: () => {
        Swal.fire('Success', 'Subcategory added!', 'success');
        this.subCategoryForm.reset();
      },
      error: () => Swal.fire('Error', 'Failed to add subcategory.', 'error')
    });
  }
 
  getCategoryNameById(id: number): string {
    const category = this.categories.find(c => c.categoriesId === id);
    return category ? category.name : 'Unknown';
  }
  
  deleteCategory(id: number) {
    this.interestService.deleteCategory(id).subscribe({
      next: () => {
        Swal.fire('Success', 'Category deleted!', 'success');
        this.loadCategories();  // Reload the categories after deletion
      },
      error: (err) => {
        console.error('Error deleting category:', err);
        Swal.fire('Error', 'Failed to delete category.', 'error');
      }
    });
  }
  deleteSubCategory(id: number) {
    this.interestService.deleteSubCategory(id).subscribe({
      next: () => {
        Swal.fire('Success', 'Subcategory deleted!', 'success');
        this.loadSubcategories();  // Reload the subcategories after deletion
      },
      error: (err) => {
        console.error('Error deleting subcategory:', err);
        Swal.fire('Error', 'Failed to delete subcategory.', 'error');
      }
    });
  }

 
}