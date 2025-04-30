import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
}

interface CategoryWithSubs extends Category {
  subcategories: Subcategory[];
}

@Injectable({
  providedIn: 'root'
})

export class InterestsService {
  constructor(private http: HttpClient) {}
  // private apiUrl = '  https://localhost:7215/api/Roles';
  addRole(roleData: any) {
    return this.http.post('https://localhost:7215/api/Roles', roleData);
  }
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7215/api/Categories').pipe(
      map(data => {
        console.log('Categories API Response:', data);
        return data;
      })
    );
  }
  addCategory(category: any) {
    return this.http.post('https://localhost:7215/api/Categories', category);
  }
  addSubCategory(subCategory: any) {
    return this.http.post('https://localhost:7215/api/SubCategories', subCategory);
  }
  deleteCategory(id: number) {
    return this.http.delete(`https://localhost:7215/api/Categories/${id}`);
  }
  deleteSubCategory(id: number) {
    return this.http.delete(`https://localhost:7215/api/SubCategories/${id}`);
  }
  getSubcategories(): Observable<any[]> {
    console.log('Fetching subcategories from API...');
    return this.http.get<any[]>('https://localhost:7215/api/SubCategories').pipe(
      map(data => {
        console.log('Subcategories received:', data);
        return data;
      })
    );
  }
  registerUser(data: any): Observable<any> {
    return this.http.post('https://localhost:7215/api/Auth/register', data);
  }
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7215/api/Roles'); // Replace with actual endpoint
  }
  getCategoriesWithSubcategories(): Observable<CategoryWithSubs[]> {
    return forkJoin({
      categories: this.getCategories(),
      subcategories: this.getSubcategories()
    }).pipe(
      map(({ categories, subcategories }: { categories: Category[]; subcategories: Subcategory[] }) => {
        console.log('Fetched Categories:', categories);
        console.log('Fetched Subcategories:', subcategories);
        
        return categories.map(cat => ({
          ...cat,
          subcategories: subcategories.filter(sub => sub.categoryId === cat.id)
        }));
      })
    );
  }
  getModules() {
    return this.http.get<any[]>('https://localhost:7215/api/Modules');
  }
  addModule(moduleData: any) {
    return this.http.post('https://localhost:7215/api/Modules', moduleData);
  }
  // deleteModule(id: number) {
  //   return this.http.delete(/api/modules/${id});
  // }
  getMenuItems() {
    return this.http.get<any[]>('https://localhost:7215/api/MenuItems');
  }
  addMenuItem(data: any) {
    return this.http.post('https://localhost:7215/api/MenuItems', data);
  }
  // deleteMenuItem(id: number) {
  //   return this.http.delete(/api/menuitems/${id});
  // }
  getRoleMenuItems() {
    return this.http.get<any[]>('https://localhost:7215/api/RoleMenuItems');
  }
  addRoleMenuItem(roleMenuItem: { roleId: number, menuId: number }) {
    return this.http.post('https://localhost:7215/api/RoleMenuItems', roleMenuItem);
  }
  // deleteRoleMenuItem(id: number) {
  //   return this.http.delete(/api/rolemenuitems/${id});
  // }
}