import { Subscription } from "./subscription.model";
import { Person } from "./person.model";

export interface Client {
  idClient: number;
  idPerson: number;
  clientType: string;
  person: Person;
  subscriptions?: Subscription[];
}
