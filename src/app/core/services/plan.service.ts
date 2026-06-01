import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plan, CreatePlanDto, UpdatePlanDto } from './../models/plan.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll() {
    return this.http.get<Plan[]>(`${this.apiUrl}/plan`);
  }

  getOne(id: Plan['idPlan']) {
    return this.http.get<Plan>(`${this.apiUrl}/plan/${id}`);
  }

  create(data: CreatePlanDto) {
    return this.http.post<Plan>(`${this.apiUrl}/plan`, data);
  }

  update(id: Plan['idPlan'], data: UpdatePlanDto) {
    return this.http.put<Plan>(`${this.apiUrl}/plan/${id}`, data);
  }

  delete(id: Plan['idPlan']) {
    return this.http.delete<number>(`${this.apiUrl}/plan/${id}`);
  }
}
