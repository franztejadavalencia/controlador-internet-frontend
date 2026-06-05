import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Payment, CreatePaymentDto, UpdatePaymentDto } from './../models/payment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll() {
    return this.http.get<Payment[]>(`${this.apiUrl}/payment`);
  }

  getOne(id: Payment['idPayment']) {
    return this.http.get<Payment>(`${this.apiUrl}/payment/${id}`);
  }

  create(data: CreatePaymentDto) {
    return this.http.post<Payment>(`${this.apiUrl}/payment`, data);
  }

  update(id: Payment['idPayment'], data: UpdatePaymentDto) {
    return this.http.put<Payment>(`${this.apiUrl}/payment/${id}`, data);
  }

  delete(id: Payment['idPayment']) {
    return this.http.delete<number>(`${this.apiUrl}/payment/${id}`);
  }
}
