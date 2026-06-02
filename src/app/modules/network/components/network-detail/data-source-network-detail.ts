import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

import { NetworkDetail } from '../../../../core/models/network-detail.model';

export class DataSourceNetworkDetail extends DataSource<NetworkDetail> {
  data = new BehaviorSubject<NetworkDetail[]>([]);
  originalData: NetworkDetail[] = [];
  length = 0;

  connect(): Observable<NetworkDetail[]> {
    return this.data;
  }

  init(networkDetail: NetworkDetail[]) {
    this.originalData = networkDetail;
    this.data.next(networkDetail);
  }

  find(input: string) {
    const finded = this.originalData.filter((item) => {
      const txt = `
        ${item.subscription?.client?.person?.firstName} ${item.subscription?.client?.person?.lastName}
        ${item.subscription?.plan?.name}-
        ${item.ipAddress}-
        ${item.macAddress}-
        ${item.deviceType}
      `;
      return txt.toLowerCase().includes(input.toLowerCase());
    });
    this.length = finded.length;
    this.data.next(finded);
  }

  disconnect() {}
}
