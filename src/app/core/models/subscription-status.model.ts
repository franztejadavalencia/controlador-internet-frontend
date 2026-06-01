export interface SubscriptionStatus {
  idSubscriptionStatus: number;
  name: string;
}
  export interface CreateSubscriptionStatusDto extends Omit<SubscriptionStatus, 'idSubscriptionStatus'> {}

  export interface UpdateSubscriptionStatusDto extends Partial<SubscriptionStatus> {}
  