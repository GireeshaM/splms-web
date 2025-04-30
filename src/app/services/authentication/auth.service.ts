import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private roleMap: { [key: number]: string } = {
    1: 'admin',
    2: 'instructor',
    3: 'user'
  };
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  getRoleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const payloadBase64 = token.split('.')[1];
      const decoded = atob(payloadBase64);
      const payload = JSON.parse(decoded);
  
      console.log('Decoded Token Payload:', payload); // Debugging
  
      const roleClaim = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      console.log('Role Claim:', roleClaim); // Debugging
  
      let roles = roleClaim;
      if (typeof roleClaim === 'string') {
        try {
          roles = JSON.parse(roleClaim); // If it's a stringified array
        } catch {
          roles = [roleClaim]; // fallback if not a stringified array
        }
      }
  
      if (Array.isArray(roles)) {
        const roleId = roles[1]; // Assuming 2nd item is numeric role ID
        console.log('Extracted Role ID:', roleId); // Debugging
        return this.roleMap[roleId] || null;
      }
  
      return null;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
  
  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const payloadBase64 = token.split('.')[1];
      const decoded = atob(payloadBase64);
      const payload = JSON.parse(decoded);
      
      console.log('Full Payload:', payload); // Inspect where userId is actually stored
  
      return payload.sub || payload.userId || null; // Add fallback keys if needed
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
  
  
  
  private API_URL = 'https://localhost:7215/api/auth';
// 🔗 your backend base URL
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}
 
  // Register a new user
  register(userData: any): Observable<any> {
    return this.http.post('https://localhost:7215/api/Auth/register', userData);
  }
 
 
  // Login user
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId);
        console.log('Stored userId:', res.userId);
        this.isLoggedInSubject.next(true);
      })
    );
  }
  
 
  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['']);
  }
 
  // Get JWT token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token'); // Check if a token exists
    return !!token; // Return true if token exists, false otherwise
  }
 
  // Decode token to extract role
  getRoles(): Promise<any[]> {
    return this.http.get<any[]>('https://localhost:7215/api/Roles').toPromise().then(data => data || []);
  }
 
  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getCategories(): Promise<any[]> {
    return this.http.get<any[]>('https://localhost:7215/api/Categories').toPromise().then(data => data || []);
  }
  getSubCategoriesByCategoryId(categoryId: number): Promise<any[]> {
    return this.http
      .get<any[]>(`https://localhost:7215/api/SubCategories/ByCategory/${categoryId}`)
      .toPromise()
      .then(data => data || []);
  }
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
  sendOtp(email: string): Observable<any> {
    const payload = { email };
    console.log('Sending POST request to API:', payload); // Debugging log
    return this.http.post('https://localhost:7215/api/Auth/forgot-password', payload, { responseType: 'text' });
  }
  verifyOtp(payload: { Code: string; Email: string }): Observable<any> {
    console.log('Sending POST request to verify OTP:', payload); // Debugging log
    return this.http.post('https://localhost:7215/api/Auth/verify-code', payload);
  }
  resetPassword(payload: { email: string; newPassword: string; confirmPassword: string }): Observable<any> {
    return this.http.post('https://localhost:7215/api/Auth/reset-password', payload);
  }
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
  
    const decoded = this.jwtHelper.decodeToken(token);
    console.log('Decoded token:', decoded);
  
    const roles = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (Array.isArray(roles) && roles.length > 0) {
      return roles[0].toLowerCase(); // This will return "admin"
    }
  
    return null;
  }

  getLoggedInUser(): { fullName: string; email: string; photoPath: string } | null {
    const token = this.getToken();
    if (!token) return null;
  
    const decoded = this.jwtHelper.decodeToken(token);
    console.log('Decoded user info:', decoded);
  
    return {
      fullName: decoded['FullName'] || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email'] || '',
      photoPath: decoded['PhotoPath'] || ''
    };
  }

}
 
