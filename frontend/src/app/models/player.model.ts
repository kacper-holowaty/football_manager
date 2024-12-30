export interface Player {
    readonly id: string;
    readonly photo?: File;
    readonly name: string;
    readonly birthDate: Date;
    readonly nationality: string;
    readonly position: string;
    readonly shirtNumber: number;
    readonly contractUntil: Date;
    readonly salary: number;
}