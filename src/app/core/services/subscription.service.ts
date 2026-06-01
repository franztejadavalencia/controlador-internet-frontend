import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, CreateSubscriptionDto, UpdateSubscriptionDto } from './../models/subscription.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll() {
    return this.http.get<Subscription[]>(`${this.apiUrl}/subscription`);
  }

  getOne(id: Subscription['idSubscription']) {
    return this.http.get<Subscription>(`${this.apiUrl}/subscription/${id}`);
  }

  create(data: CreateSubscriptionDto) {
    return this.http.post<Subscription>(`${this.apiUrl}/subscription`, data);
  }

  update(id: Subscription['idSubscription'], data: UpdateSubscriptionDto) {
    return this.http.put<Subscription>(`${this.apiUrl}/subscription/${id}`, data);
  }

  delete(id: Subscription['idSubscription']) {
    return this.http.delete<number>(`${this.apiUrl}/subscription/${id}`);
  }
}
