import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

import { Client } from '../../../../core/models/client.model';

export class DataSourceClient extends DataSource<Client> {
  data = new BehaviorSubject<Client[]>([]);
  originalData: Client[] = [];
  length = 0;

  connect(): Observable<Client[]> {
    return this.data;
  }

  init(client: Client[]) {
    this.originalData = client;
    this.data.next(client);
  }

  find(input: string) {
    const finded = this.originalData.filter((item) => {
      const txt = `
        ${item.code}-
        ${item.person?.firstName}-
        ${item.person?.lastName}-
        ${item.clientType}
      `;
      return txt.toLowerCase().includes(input.toLowerCase());
    });
    this.length = finded.length;
    this.data.next(finded);
  }

  disconnect() {}
}
