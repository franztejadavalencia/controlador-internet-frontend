import { Subscription } from "rxjs";
import { Client } from "./client.model";
import { Person } from "./person.model";
import { Plan } from "./plan.model";
import { Payment } from "./payment.model";
import { NetworkDetails } from "./network-details.model";
import { ClientType } from "./client-type.model";

export interface OutPerson {
  person: Person;
}

export interface InPerson {
  person: Person;
}

export interface OutPlan {
  plan: Plan;
}

export interface InPlan {
  plan: Plan;
}

export interface OutClient {
  client: Client;
}

export interface InClient {
  client: Client;
  persons: Person[];
  clientTypes: ClientType[];
}

export interface OutSubscription {
  subscription: Subscription;
}

export interface InSubscription {
  subscription: Subscription;
}

export interface OutPayment {
  payment: Payment;
}

export interface InPayment {
  payment: Payment;
}

export interface OutNetworkDetails {
  networkDetails: NetworkDetails;
}

export interface InNetworkDetails {
  networkDetails: NetworkDetails;
}