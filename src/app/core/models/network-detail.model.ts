import { DeviceType } from "./device-type.model";
import { Subscription } from "./subscription.model";

export interface NetworkDetail {
  idNetworkDetail: number;
  idSubscription: number;
  deviceHostName: string;
  macAddress: string;
  ipAddress: string;
  idDeviceType: number;
  subscription?: Subscription;
  deviceType?: DeviceType;
}

export interface CreateNetworkDetailDto extends Omit<NetworkDetail, 'idNetworkDetail'> {}

export interface UpdateNetworkDetailDto extends Partial<NetworkDetail> {}
