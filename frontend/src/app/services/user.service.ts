import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { ChangePasswordRequest } from '../models/change-password-request.model';
import { Response } from '../models/response.type';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;

  public constructor(private httpClient: HttpClient, private toastService: ToastService) { }

  public updateUser(userId: string, user: Partial<User>): Observable<User> {
    return this.httpClient.patch<Response<User>>(`${this.apiUrl}/users/${userId}`, user)
      .pipe(
        map((res: Response<User>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public changePassword(userId: string, request: ChangePasswordRequest): Observable<void> {
    return this.httpClient.patch<void>(`${this.apiUrl}/users/${userId}/password`, request)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }
}
