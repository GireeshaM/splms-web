import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AddCategoryComponent } from './folder/add-category/add-category.component';
import { AddModuleComponent } from './folder/add-module/add-module.component';
import { AddMenuItemsComponent } from './folder/add-menu-items/add-menu-items.component';
import { AddRoleMenuItemsComponent } from './folder/add-role-menu-items/add-role-menu-items.component';
import { CarouselComponent } from './carousel/carousel.component';
import { TopTrendsComponent } from './top-trends/top-trends.component';

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

  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'add-category',
    component: AddCategoryComponent,
  },
  {
    path: 'add-module',
    component: AddModuleComponent,
  },
  {
    path: 'add-menu-items',
    component: AddMenuItemsComponent,
  },
  {
    path: 'add-role-menu-items',
    component: AddRoleMenuItemsComponent,
  },
  {
    path: 'carousel',
    component: CarouselComponent,
  },
  {
    path: 'top-trends',
    component: TopTrendsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
