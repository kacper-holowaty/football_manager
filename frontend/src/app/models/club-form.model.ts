import { FormControl, FormGroup } from '@angular/forms';

export interface ClubForm {
  readonly name: FormControl<string | null>;
  readonly badge: FormControl<Blob | null>;
  readonly foundedYear: FormControl<number | null>;
  readonly stadiumName: FormControl<string | null>;
  readonly stadiumCapacity: FormControl<number | null>;
  readonly address: FormGroup<AddressForm>;
}
 
export interface AddressForm {
  readonly street: FormControl<string | null>;
  readonly houseNumber: FormControl<string | null>;
  readonly apartmentNumber: FormControl<string | null>;
  readonly postalCode: FormControl<string | null>;
  readonly city: FormControl<string | null>;
  readonly country: FormControl<string | null>;
}