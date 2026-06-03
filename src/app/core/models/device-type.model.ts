import { NetworkDetail } from "./network-detail.model";

export interface DeviceType {
  idDeviceType: number;
  name: string;
  icon?: string;
  networkDetails?: NetworkDetail[];
}
 export interface CreateDeviceTypeDto extends Omit<DeviceType, 'idDeviceType'> {}

 export interface UpdateDeviceTypeDto extends Partial<DeviceType> {}
