export interface ClientType {
  idClientType: number;
  name: string;
}
 export interface CreateClientTypeDto extends Omit<ClientType, 'idClientType'> {}

 export interface UpdateClientTypeDto extends Partial<ClientType> {}