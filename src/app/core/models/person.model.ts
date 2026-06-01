export interface Person {
  idPerson: number;
  firstName: string;
  lastName: string;
  ci: string;
  email: string;
}

export interface CreatePersonDto extends Omit<Person, 'idPerson'> {}

export interface UpdatePersonDto extends Partial<CreatePersonDto> {}
