import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Module {
  moduleId: number;
  moduleName: string;
  icon: string;
  url: string;
}

interface MenuItem {
  menuId: number;
  menuItemName: string;
  moduleId: number;
  icon: string;
  url: string;
}

interface RoleMenuItem {
  roleMenuId: number;
  roleId: number;
  menuId: number;
}
@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  fullName: string = '';
  photoUrl: string = 'assets/default-user.png';
  isLoggedIn: boolean = false;

  modules: Module[] = [];
  menuItems: MenuItem[] = [];
  roleMenuItems: RoleMenuItem[] = [];
  filteredModules: { module: Module; items: MenuItem[] }[] = [];
  isHomePage: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
  
      if (loggedIn) {
        const user = this.authService.getLoggedInUser();
        if (user) {
          this.fullName = user.fullName;
          this.photoUrl = user.photoPath;
        }
  
        const role = this.authService.getUserRole();
        if (role) {
          this.loadNavbarItems(role);
        }
      } else {
        this.fullName = '';
        this.photoUrl = 'assets/default-user.png';
        this.filteredModules = [];
      }
    });
  
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.urlAfterRedirects === '/';
      }
    });
  }

  async loadNavbarItems(roleName: string) {
    try {
      // Fetch all required data
      const [modules, menuItems, roleMenuItems, roles] = await Promise.all([
        this.http.get<Module[]>('https://localhost:7215/api/Modules').toPromise(),
        this.http.get<MenuItem[]>('https://localhost:7215/api/MenuItems').toPromise(),
        this.http.get<RoleMenuItem[]>('https://localhost:7215/api/RoleMenuItems').toPromise(),
        this.http.get<any[]>('https://localhost:7215/api/Roles').toPromise()
      ]) as [Module[], MenuItem[], RoleMenuItem[], any[]];
  
      // Assign the values safely
      this.modules = modules || [];
      this.menuItems = menuItems || [];
      this.roleMenuItems = roleMenuItems || [];
  
      const role = roles.find(r => r.name.toLowerCase() === roleName.toLowerCase());
      if (!role) {
        console.warn(`Role "${roleName}" not found.`);
        this.filteredModules = [];
        return;
      }
      const menuIdsForRole = this.roleMenuItems
        .filter(rm => rm.roleId === role.rolesId)
        .map(rm => rm.menuId);
  
      const filteredMenuItems = this.menuItems.filter(m => menuIdsForRole.includes(m.menuId));
  
      const grouped = this.modules
        .map(module => {
          const items = filteredMenuItems.filter(item => item.moduleId === module.moduleId);
          return { module, items };
        })
        .filter(group => group.items.length > 0);
  
      this.filteredModules = grouped;
  
    } catch (error) {
      console.error('Failed to load navbar items:', error);
      this.filteredModules = [];
    }
  }
  logout(): void {
    this.authService.logout();
    localStorage.removeItem('token'); 
    this.isLoggedIn = false; // Update login status
    this.router.navigate(['']);
      this.filteredModules = [];
  }

  goToDashboard(): void {
    const role = this.authService.getUserRole(); // Get the user's role
    if (role === 'admin') {
      this.router.navigate(['/admin/dashboard']); // Redirect to admin dashboard
    } else if (role === 'instructor') {
      this.router.navigate(['/instructor/dashboard']); // Redirect to teacher dashboard
    } else if (role === 'user') {
      this.router.navigate(['/user/dashboard']); // Redirect to student dashboard
    } else {
      this.router.navigate(['/default-dashboard']); // Redirect to a default dashboard if no role matches
    }
  }
  //new code
  
  onSearch(): void {
  }
  viewProfile() {
    this.router.navigate(['/profile']);
  }
  

}