export interface Player {
  readonly playerId: string;
  readonly photoUrl?: string;
  readonly name: string;
  readonly birthDate: Date;
  readonly nationality: string;
  readonly positions: string[];
  readonly shirtNumber: number;
  readonly contractUntil: Date;
  readonly salary: number;
  readonly clubId: string;
  readonly hasPhoto?: boolean;
}

export interface PlayerRequest {
  readonly photo: Blob | null;
  readonly name: string;
  readonly birthDate: string;
  readonly nationality: string;
  readonly positions: string[];
  readonly shirtNumber: number;
  readonly contractUntil: string;
  readonly salary: number;
  readonly clubId: string;
}