import { Subscription } from "./subscription.model";

export interface NetworkDetail {
  idNetworkDetail: number;
  idSubscription: number;
  macAddress: string;
  ipAddress: string;
  deviceType: string;
  subscription?: Subscription;
}

export interface CreateNetworkDetailDto extends Omit<NetworkDetail, 'idNetworkDetail'> {}

export interface UpdateNetworkDetailDto extends Partial<NetworkDetail> {}
