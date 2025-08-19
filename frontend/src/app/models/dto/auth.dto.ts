import { User } from "../user.model";

export interface AuthDto {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: User;
}

export interface RefreshTokenDto {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface AuthPayload {
  readonly login: string;
  readonly password: string;
}