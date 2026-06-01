import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubscriptionStatus } from './../models/subscription-status.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionStatusService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll() {
    return this.http.get<SubscriptionStatus[]>(`${this.apiUrl}/subscription-status`);
  }
}
