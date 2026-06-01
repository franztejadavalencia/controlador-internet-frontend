import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, CreateClientDto, UpdateClientDto } from './../models/client.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll() {
    return this.http.get<Client[]>(`${this.apiUrl}/client`);
  }

  getOne(id: Client['idClient']) {
    return this.http.get<Client>(`${this.apiUrl}/client/${id}`);
  }

  create(data: CreateClientDto) {
    return this.http.post<Client>(`${this.apiUrl}/client`, data);
  }

  update(id: Client['idClient'], data: UpdateClientDto) {
    return this.http.put<Client>(`${this.apiUrl}/client/${id}`, data);
  }

  delete(id: Client['idClient']) {
    return this.http.delete<number>(`${this.apiUrl}/client/${id}`);
  }
}
