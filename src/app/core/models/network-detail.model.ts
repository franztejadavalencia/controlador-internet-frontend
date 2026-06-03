import { DeviceType } from "./device-type.model";
import { Subscription } from "./subscription.model";

export interface NetworkDetail {
  idNetworkDetail: number;
  idSubscription: number;
  deviceHostName: string;
  idDeviceType: number;
  macAddress: string;
  ipAddress: string;
  subscription?: Subscription;
  deviceType?: DeviceType;
}

export interface CreateNetworkDetailDto extends Omit<NetworkDetail, 'idNetworkDetail'> {}

export interface UpdateNetworkDetailDto extends Partial<NetworkDetail> {}
