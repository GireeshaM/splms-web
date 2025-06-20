import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { SubCategory } from '../Models';

@Component({
  selector: 'app-sub-categories',
  imports: [CommonModule,FormsModule],
  templateUrl: './sub-categories.component.html',
  styleUrl: './sub-categories.component.css'
})
export class SubCategoriesComponent implements OnInit {

  categories: any[] = [];          // Store categories
  subCategories: SubCategory[] = []; // Store subcategories
  selectedCategoryId: number = 0; // Currently selected category ID
  newSubCategory: string = '';    // New subcategory name input
  apiUrl = 'https://localhost:7215/api/SubCategories';  // API URL for SubCategories

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch categories on component load
    this.fetchCategories();
  }

  // Fetch categories from the API
  fetchCategories() {
    this.http.get<any[]>('https://localhost:7215/api/Categories').subscribe(
      (response) => {
        this.categories = response;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }

  // Fetch subcategories based on selected category
  fetchSubCategories() {
    if (this.selectedCategoryId) {
      this.http.get<SubCategory[]>(`${this.apiUrl}/ByCategory/${this.selectedCategoryId}`).subscribe(
        (response) => {
          this.subCategories = response;
        },
        (error) => {
          console.error('Error fetching subcategories', error);
        }
      );
    }
  }

  // Create a new subcategory
  addSubCategory() {
    const newSubCategory: SubCategory = {
      subCategoriesId: 0,
      name: this.newSubCategory,
      categoryId: this.selectedCategoryId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.http.post<SubCategory>(this.apiUrl, newSubCategory).subscribe(
      (response) => {
        this.subCategories.push(response); // Add the new subcategory to the list
        this.newSubCategory = ''; // Clear the input field
      },
      (error) => {
        console.error('Error adding subcategory', error);
      }
    );
  }

  // Delete a subcategory
  deleteSubCategory(subCategoryId: number) {
    this.http.delete(`${this.apiUrl}/${subCategoryId}`).subscribe(
      () => {
        this.subCategories = this.subCategories.filter(sub => sub.subCategoriesId !== subCategoryId);
      },
      (error) => {
        console.error('Error deleting subcategory', error);
      }
    );
  }
}