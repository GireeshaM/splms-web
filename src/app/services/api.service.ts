// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'https://localhost:7215/api';
  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  getById<T>(url: string, id: number): Observable<T> {
    return this.http.get<T>(`${url}/${id}`);
  }

  post<T>(url: string, data: T): Observable<T> {
    return this.http.post<T>(url, data);
  }

  put<T>(url: string, id: number, data: T): Observable<T> {
    return this.http.put<T>(`${url}/${id}`, data);
  }

  delete(url: string, id: number): Observable<void> {
    return this.http.delete<void>(`${url}/${id}`);
  }

  
  // Directly use the provided API URL to fetch roles
    getRoles(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7215/api/Roles');
  }




}
