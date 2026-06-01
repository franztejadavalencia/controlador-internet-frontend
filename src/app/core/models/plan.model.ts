export interface Plan {
  idPlan: number;
  name: string;
  downloadSpeed: number;
  uploadSpeed: number;
  price: number;
  isActive: boolean;
}

export interface CreatePlanDto extends Omit<Plan, 'idPlan'> {}

export interface UpdatePlanDto extends Partial<CreatePlanDto> {}
