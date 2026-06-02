import { Client } from "./client.model";
import { NetworkDetail } from "./network-detail.model";
import { Plan } from "./plan.model";
import { SubscriptionStatus } from "./subscription-status.model";

export interface Subscription {
  idSubscription: number;
  code: string;
  expirationDate: Date | string;
  idPlan: number;
  idClient: number;
  idSubscriptionStatus: number;
  plan?: Plan;
  client?: Client;
  subscriptionStatus?: SubscriptionStatus;
  networkDetail?: NetworkDetail;
}

export interface CreateSubscriptionDto extends Omit<Subscription, 'idSubscription' | 'code'> {}

export interface UpdateSubscriptionDto extends Partial<Subscription> {}
