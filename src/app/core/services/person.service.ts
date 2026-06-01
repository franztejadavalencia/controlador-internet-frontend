import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person, CreatePersonDto, UpdatePersonDto } from './../models/person.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll() {
    return this.http.get<Person[]>(`${this.apiUrl}/person`);
  }

  getOne(id: Person['idPerson']) {
    return this.http.get<Person>(`${this.apiUrl}/person/${id}`);
  }

  create(data: CreatePersonDto) {
    return this.http.post<Person>(`${this.apiUrl}/person`, data);
  }

  update(id: Person['idPerson'], data: UpdatePersonDto) {
    return this.http.put<Person>(`${this.apiUrl}/person/${id}`, data);
  }

  delete(id: Person['idPerson']) {
    return this.http.delete<number>(`${this.apiUrl}/person/${id}`);
  }
}
