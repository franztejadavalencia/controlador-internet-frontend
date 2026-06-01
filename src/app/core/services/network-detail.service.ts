import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NetworkDetail, CreateNetworkDetailDto, UpdateNetworkDetailDto } from './../models/network-detail.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NetworkDetailService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll() {
    return this.http.get<NetworkDetail[]>(`${this.apiUrl}/network-details`);
  }

  getOne(id: NetworkDetail['idNetworkDetail']) {
    return this.http.get<NetworkDetail>(`${this.apiUrl}/network-details/${id}`);
  }

  create(data: CreateNetworkDetailDto) {
    return this.http.post<NetworkDetail>(`${this.apiUrl}/network-details`, data);
  }

  update(id: NetworkDetail['idNetworkDetail'], data: UpdateNetworkDetailDto) {
    return this.http.put<NetworkDetail>(`${this.apiUrl}/network-details/${id}`, data);
  }

  delete(id: NetworkDetail['idNetworkDetail']) {
    return this.http.delete<number>(`${this.apiUrl}/network-details/${id}`);
  }
}
