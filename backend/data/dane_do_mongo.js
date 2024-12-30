// user

// {
//     _id: ObjectId, // albo: id: string,
//     firstName: string,
//     lastName: string,
//     email: String,
//     password: String, // hashed
//     createdAt: Date, ??
// }

//club
{
    // _id: ObjectId, // albo id: string
    // name: string,
    // badge: File,
    // city: string, 
    // owner: ObjectId, // odwołanie do User // albo owner: 'string' // albo ownerEmail: string
    // foundedYear: date // a właściwie tylko Year
    // stadiumName: string,
    // stadiumCapacity: number,
    // address: Address // nowy formularz FormGroupArray
    // players: [
    //   {id: string, name: string, dateOfBirth: date, photo: File, position: string, nationality: string, shirtNumber: number, contractUntil: date, }
    // ],
    // staff: [
    //   { id: string, name: string, role: string, salary: number, dateOfBirth: number, nationality: string },
    // ]


    // bardzoo opcjonalne (jak będą chęci)
    // trophies (lista trofeów, każde trofeum jako obiekt z polami: name, year
    // budget: number,
    // income,    //będzie można rozważyć formularze mini do dodawania nowego wydatku czy przychodu.
    // expenses

}

// players osobno do club tylko referencja do tego obiektu.

