import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QuizDto1 } from '../sections/section-model';



// Interface to define the structure of the decoded JWT token
interface DecodedToken {
  role?: string;
  Role?: string;
  roleName?: string;
  RoleName?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  RolesId?: string;
  FullName?: string;
  email?: string;
  PhotoPath?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7215/api/Auth';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  // Login method with error handling
  login(data: { email: string; password: string }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/login`, data)
      .pipe(catchError(this.handleError));
  }

  // Register method with error handling
  register(data: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/register`, data)
      .pipe(catchError(this.handleError));
  }

  // Save the JWT token to localStorage (or HttpOnly cookies as a better alternative)
  saveToken(token: string): void {
    // Saving in HttpOnly cookies (optional, if your backend supports it)
    document.cookie = `authToken=${token}; path=/; Secure; HttpOnly`;

    // Or you can still store in localStorage as fallback
    localStorage.setItem('authToken', token);
  }

  // Get the JWT token (from localStorage or cookies)
  getToken(): string | null {
    // Get from cookies
    const match = document.cookie.match('(^|;)\\s*authToken\\s*=\\s*([^;]+)');
    if (match) {
      return match[2];
    }

    // Fallback to localStorage
    return localStorage.getItem('authToken');
  }

  // Logout the user
  logout(): void {
    // Clear the token from both localStorage and cookies
    document.cookie =
      'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('authToken');
  }

  // Check if the user is authenticated (token exists and is valid)
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  // Get the role name from the token
  getUserRoleName(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.jwtHelper.decodeToken<DecodedToken>(token);

    if (!decoded) {
      return null; // If decoded is null, return null
    }

    // Try to get the role from different possible keys
    const roleName =
      decoded.role ||
      decoded.Role ||
      decoded.roleName ||
      decoded.RoleName ||
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decoded.RolesId;

    return typeof roleName === 'string' ? roleName.toLowerCase() : null;
  }

  // Get the user role ID from the token
  getUserRoleId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.jwtHelper.decodeToken<DecodedToken>(token);
    if (!decoded) {
      return null; // If decoded is null, return null
    }

    const rolesId = decoded.RolesId; // Direct access to RolesId
    return rolesId ? parseInt(rolesId, 10) : null;
  }

  getLoggedInUser(): {
    fullName: string;
    email: string;
    photoPath: string;
  } | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.jwtHelper.decodeToken<DecodedToken>(token);
    if (!decoded) {
      return null; // If decoded is null, return null
    }

    return {
       fullName:
      decoded.FullName ||
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
      email:
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email'
        ] || '',
      photoPath: decoded.PhotoPath || '',
    };
  }

  // Get the logged-in user's details (FullName, Email, PhotoPath)


  // Generic error handler for HTTP requests
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    // Optionally, show the error message to the user (e.g., with an alert or a toast)
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.jwtHelper.decodeToken(token);
    const userId =
      decoded['nameid'] || // ClaimTypes.NameIdentifier
      decoded[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];

    return userId ? +userId : null;
  }

  getUserById(userId: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/get-user/${userId}`)
      .pipe(catchError(this.handleError));
  }
 
}
 