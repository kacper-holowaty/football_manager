export interface Club {
    id: string,
    name: string,
    badge: File | null,
    ownerId: string,
    foundedYear: number,
    stadiumName: string,
    stadiumCapacity: number,
    address: Address,
    achievements: Achievement[],
}

export interface Address {
    street: string,
    houseNumber: string,
    apartmentNumber?: string,
    postalCode: string,
    city: string,
    country: string;
}

export interface Achievement {
    name: string;
    date: Date;
    description: string;
}


// bardzoo opcjonalne (jak będą chęci)
    // trophies (lista trofeów, każde trofeum jako obiekt z polami: name, year
    // budget: number,
    // income,    //będzie można rozważyć formularze mini do dodawania nowego wydatku czy przychodu.
    // expenses