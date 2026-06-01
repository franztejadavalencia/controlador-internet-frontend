import { Client } from "./client.model";
import { NetworkDetails } from "./network-details.model";
import { Plan } from "./plan.model";

export interface Subscription {
  idSubscription: number;
  status: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  expirationDate: Date | string;
  idPlan: number;
  idClient: number;
  plan?: Plan;
  client?: Client;
  networkDetails?: NetworkDetails;
}
