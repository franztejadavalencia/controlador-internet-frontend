import { Subscription } from "./subscription.model";
import { Person } from "./person.model";
import { ClientType } from "./client-type.model";

export interface Client {
  idClient: number;
  idPerson: number;
  idClientType: number;
  person: Person;
  clientType: ClientType;
  subscriptions?: Subscription[];
}
 export interface CreateClientDto extends Omit<Client, 'idClient'> {}

 export interface UpdateClientDto extends Partial<Client> {}
 