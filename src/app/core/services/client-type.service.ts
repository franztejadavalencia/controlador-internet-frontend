import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClientType } from './../models/client-type.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientTypeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll() {
    return this.http.get<ClientType[]>(`${this.apiUrl}/client-type`);
  }
}
