import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  instructorUserId$ = new BehaviorSubject<number | null>(null);

  constructor() { 
    
  }
}