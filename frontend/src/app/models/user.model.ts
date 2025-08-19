export interface User {
  readonly id: string;
  readonly firstName: string,
  readonly lastName: string,
  readonly username: string,
  readonly email: string,
}

export interface UserRequest {
  readonly firstName: string,
  readonly lastName: string,
  readonly username: string,
  readonly email: string,
  readonly password: string,
}