import { Client } from "./client.model";
import { Person } from "./person.model";
import { Plan } from "./plan.model";
import { Payment } from "./payment.model";
import { NetworkDetail } from "./network-detail.model";
import { ClientType } from "./client-type.model";
import { SubscriptionStatus } from "./subscription-status.model";
import { Subscription } from "./subscription.model";
import { DeviceType } from "./device-type.model";

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
  clients: Client[];
  plans: Plan[];
  subscriptionStatus: SubscriptionStatus[];
}

export interface OutPayment {
  payment: Payment;
}

export interface InPayment {
  payment: Payment;
}

export interface OutNetworkDetails {
  networkDetail: NetworkDetail;
}

export interface InNetworkDetails {
  networkDetail: NetworkDetail;
  subscriptions: Subscription[];
  deviceTypes: DeviceType[];
}
