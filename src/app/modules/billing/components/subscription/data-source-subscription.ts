import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

import { Subscription } from '../../../../core/models/subscription.model';

export class DataSourceSubscription extends DataSource<Subscription> {
  data = new BehaviorSubject<Subscription[]>([]);
  originalData: Subscription[] = [];
  length = 0;

  connect(): Observable<Subscription[]> {
    return this.data;
  }

  init(subscription: Subscription[]) {
    this.originalData = subscription;
    this.data.next(subscription);
  }

  find(input: string) {
    const finded = this.originalData.filter((item) => {
      const txt = `
        ${item.client?.person.firstName} ${item.client?.person.lastName}-
        ${item.plan?.name}-
        ${item.expirationDate}-
        ${item.subscriptionStatus?.name}`;
      return txt.toLowerCase().includes(input.toLowerCase());
    });
    this.length = finded.length;
    this.data.next(finded);
  }

  disconnect() {}
}
