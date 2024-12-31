import { Address } from "./address.model";

export interface Club {
    id: string,
    name: string,
    badge?: File,
    ownerId: string,
    foundedYear: number,
    stadiumName: string,
    stadiumCapacity: number,
    address: Address,
}


// bardzoo opcjonalne (jak będą chęci)
    // trophies (lista trofeów, każde trofeum jako obiekt z polami: name, year
    // budget: number,
    // income,    //będzie można rozważyć formularze mini do dodawania nowego wydatku czy przychodu.
    // expenses