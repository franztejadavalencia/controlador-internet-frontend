import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

import { Person } from '../../../../core/models/person.model';

export class DataSourcePerson extends DataSource<Person> {
  data = new BehaviorSubject<Person[]>([]);
  originalData: Person[] = [];
  length = 0;

  connect(): Observable<Person[]> {
    return this.data;
  }

  init(person: Person[]) {
    this.originalData = person;
    this.data.next(person);
  }

  find(input: string) {
    const finded = this.originalData.filter((item) => {
      const txt = `${item.firstName}-${item.lastName}-${item.ci}-${item.email}`;
      return txt.toLowerCase().includes(input.toLowerCase());
    });
    this.length = finded.length;
    this.data.next(finded);
  }

  disconnect() {}
}
