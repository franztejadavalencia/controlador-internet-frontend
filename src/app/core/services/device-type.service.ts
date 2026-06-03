import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeviceType } from './../models/device-type.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeviceTypeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll() {
    return this.http.get<DeviceType[]>(`${this.apiUrl}/device-types`);
  }
}
