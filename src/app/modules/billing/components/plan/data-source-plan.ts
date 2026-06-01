import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

import { Plan } from '../../../../core/models/plan.model';

export class DataSourcePlan extends DataSource<Plan> {
  data = new BehaviorSubject<Plan[]>([]);
  originalData: Plan[] = [];
  length = 0;

  connect(): Observable<Plan[]> {
    return this.data;
  }

  init(plan: Plan[]) {
    this.originalData = plan;
    this.data.next(plan);
  }

  find(input: string) {
    const finded = this.originalData.filter((item) => {
      const txt = `${item.name}-${item.price}-${item.downloadSpeed}-${item.uploadSpeed}`;
      return txt.toLowerCase().includes(input.toLowerCase());
    });
    this.length = finded.length;
    this.data.next(finded);
  }

  disconnect() {}
}
