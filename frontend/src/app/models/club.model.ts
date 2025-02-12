export interface Club {
  readonly clubId: string,
  readonly name: string,
  readonly badge: Blob | null,
  readonly ownerId: string,
  readonly foundedYear: number,
  readonly stadiumName: string,
  readonly stadiumCapacity: number,
  readonly address: Address,
  readonly achievements: Achievement[],
}

export interface Address {
  readonly street: string,
  readonly houseNumber: string,
  readonly apartmentNumber?: string,
  readonly postalCode: string,
  readonly city: string,
  readonly country: string;
}

export interface Achievement {
  readonly name: string;
  readonly date: Date;
  readonly description: string;
}