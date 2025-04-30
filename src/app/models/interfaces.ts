export interface Login {
    email: string;
    password: string;
  }
 
  export interface Register {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    roleId: number;
    selectedCategories: number[];
    selectedSubCategories: { [key: number]: number[] };
  }
  export interface UserDetails {
    id: string; // Add id
    roleId: string;
    fullName?: string;
    email?: string;
  }

  export interface AspNetRoleMenuItemDto {
    roleMenuId: number;
    roleId: number;
    menuId: number;
  }
  
  export interface AspNetMenuItemDto {
    menuId: number;
    menuItemName: string;
    moduleId: number;
    icon: string;
    url: string;
  }
  
  export interface AspNetModuleDto {
    moduleId: number;
    moduleName: string;
    icon: string;
    url: string;
    status: boolean;
  }