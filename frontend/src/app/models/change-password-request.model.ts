export interface ChangePasswordRequest {
  readonly oldPassword: string;
  readonly newPassword: string;
}