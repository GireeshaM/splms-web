import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminModule } from './core/admin/admin.module';
import { AdminGuard } from './guards/admin.guard';
import { InstructorModule } from './core/instructor/instructor.module';
import { instructorGuard } from './guards/instructor.guard';
import { UserModule } from './core/user/user.module';
import { userGuard } from './guards/user.guard';
import { AddRoleComponent } from './folder/add-role/add-role.component';
import { AboutUsComponent } from './about-us/about-us.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'core',
    loadChildren: () =>
      import('../app/core/core.module').then((m) => m.CoreModule),
  },
  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // { 
  //   path: 'admin', 
  //   loadChildren: () => 
  //     import('./core/admin/admin.module').then((m) => m.AdminModule), 
  //   canActivate: [AdminGuard] 
  // },
  // { 
  //   path: 'instructor', 
  //   loadChildren: () => 
  //     import('./core/instructor/instructor.module').then((m) => m.InstructorModule), 
  //   canActivate: [instructorGuard] 
  // },
  // { 
  //   path: 'user', 
  //   loadChildren: () => 
  //     import('./core/user/user.module').then((m) => m.UserModule), 
  //   canActivate: [userGuard] 
  // },
  {path:'admin/dashboard', loadChildren: () => import('./core/admin/admin.module').then(m => m.AdminModule), canActivate: [AdminGuard]},
  {path:'instructor/dashboard', loadChildren: () => import('./core/instructor/instructor.module').then(m => m.InstructorModule), canActivate: [instructorGuard]},
  {path:'user/dashboard', loadChildren: () => import('./core/user/user.module').then(m => m.UserModule), canActivate: [userGuard]},
  { path: '', component:HomeComponent, pathMatch: 'full' },
  {path:'add-role',component:AddRoleComponent},
  {path:'add-category',loadComponent:()=>import('./folder/add-category/add-category.component').then(m=>m.AddCategoryComponent)},
  {path:'add-module',loadComponent:()=>import('./folder/add-module/add-module.component').then(m=>m.AddModuleComponent)},
  {path:'add-menu-items',loadComponent:()=>import('./folder/add-menu-items/add-menu-items.component').then(m=>m.AddMenuItemsComponent)},
  {path:'add-role-menu-items',loadComponent:()=>import('./folder/add-role-menu-items/add-role-menu-items.component').then(m=>m.AddRoleMenuItemsComponent)},
  {path:'carousel',loadComponent:()=>import('./carousel/carousel.component').then(m=>m.CarouselComponent)},
  {path:'top-trends',loadComponent:()=>import('./top-trends/top-trends.component').then(m=>m.TopTrendsComponent)},
  {path:'about-us',component:AboutUsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
