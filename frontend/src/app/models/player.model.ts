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
    readonly clubId: string;
}

// pomysły jak to można rozbudować:
// height
// weight
// prefferedFoot
// injuryStatus
// isCaptain ??? jakoś to fajnie obsłużyć by trzeba było

// takie bardziej jak starczy czasu parametry:
// gamesPlayed
// goals
// assists
// yellowCards 
// redCards
// releaseClause
// marketValue
// socialMediaLinks string[] (takie już bardziej for fun)