import { Subscription } from "./subscription.model";

export interface Payment {
  idPayment: number;
  amount: number;
  paymentDate: string;
  montsPayed: number;
  subscription: Subscription;
}
