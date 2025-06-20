// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { JwtModule } from '@auth0/angular-jwt';

// ✅ Token getter function
export function tokenGetter() {
  return localStorage.getItem('authToken');
}

bootstrapApplication(AppComponent, {
  
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(
      ToastrModule.forRoot(),

      // ✅ Import JwtModule properly
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:7215'],
          disallowedRoutes: [
            'https://localhost:7215/api/Auth/login',
            'https://localhost:7215/api/Auth/register'
          ]
        }
      })
    )
  ]
});