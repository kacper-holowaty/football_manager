export interface Player {
  readonly playerId: string;
  readonly photo: Blob | null;
  readonly name: string;
  readonly birthDate: Date;
  readonly nationality: string;
  readonly position: string;
  readonly shirtNumber: number;
  readonly contractUntil: Date;
  readonly salary: number;
  readonly clubId: string;
  readonly clubOwnerId: string;
}