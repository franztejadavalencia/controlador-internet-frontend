import { Subscription } from "./subscription.model";

export interface Payment {
  idPayment: number;
  idSubscription: number;
  amount: number;
  paymentDate: string;
  montsPayed: number;
  subscription?: Subscription;
}

export interface CreatePaymentDto extends Omit<Payment, 'idPayment'> {}

export interface UpdatePaymentDto extends Partial<Payment> {}
