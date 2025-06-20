// src/app/models/role.model.ts
export interface Role {
    rolesId: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }

export interface Category {
    categoriesId: number;
    name: string;
    createdAt: string;
  }
  
  export interface SubCategory {
    subCategoriesId: number;   
    name: string;             
    categoryId: number;        
    createdAt: string;         
    updatedAt: string;         
  }

 // src/app/models/module.model.ts
export interface Module {
  moduleId: number;
  moduleName: string;
  icon: string;
  url: string;
}

  
  export interface AspNetMenuItemDto {
    menuId: number;
    menuItemName: string;
    moduleId: number;
    icon: string;
    url: string;
  }
  
  export interface AspNetRoleMenuItemDto {
    roleMenuId: number;
    rolesId: number;
    menuId: number;
  }
  
  