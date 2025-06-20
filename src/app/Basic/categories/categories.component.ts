import { Component, OnInit } from '@angular/core';
import { Category } from '../Models';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  newCategory: Category = { categoriesId: 0, name: '', createdAt: '' };
  readonly apiUrl = 'https://localhost:7215/api/Categories';

  constructor(private api: ApiService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.api.get<Category[]>(this.apiUrl).subscribe({
      next: data => this.categories = data,
      error: () => this.toastr.error('Error loading categories')
    });
  }

  addCategory() {
    const now = new Date().toISOString();
    const categoryData = { ...this.newCategory, createdAt: now };

    this.api.post<Category>(this.apiUrl, categoryData).subscribe({
      next: () => {
        this.newCategory.name = '';
        this.loadCategories();
        this.toastr.success('Category added');
      },
      error: () => this.toastr.error('Add failed')
    });
  }

  deleteCategory(id: number) {
    this.api.delete(this.apiUrl, id).subscribe({
      next: () => {
        this.loadCategories();
        this.toastr.success('Deleted');
      },
      error: () => this.toastr.error('Delete failed')
    });
  }
}
