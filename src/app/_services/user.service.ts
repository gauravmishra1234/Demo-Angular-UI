import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _serviceBaseUrl: string = 'https://localhost:44330/api';
  // private _serviceBaseUrl: string = environment.environment.baseurl;
  constructor(
    private http: HttpClient
  ) {

  }
  getAll(pageNumber: number) {
    return this.http.get<any>(this._serviceBaseUrl + "/Users/GetAllUsers?pageNumber=" + pageNumber);
  }
  getById(userId: number) {
    return this.http.get<User>(this._serviceBaseUrl + "/Users/GetByUserId?userId=" + userId);
  }
  insertUser(user: User) {
    return this.http.post<any>(this._serviceBaseUrl + '/users/AddUser', user)
  }
  updateUser(user: User) {
    return this.http.put<any>(this._serviceBaseUrl + '/Users/UpdateByUserId', user)
  }
  deleteUserById(userId: number) {
    return this.http.delete<number>(this._serviceBaseUrl + '/Users/DeleteByIdUser?userId=' + userId);
  }
}
