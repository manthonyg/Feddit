import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({providedIn: 'root'})
  export class UserService {

    constructor(private _http: HttpClient) {}
    private LOCALPATH = "http://localhost:3000"

    private readonly _userSource = new BehaviorSubject<User>({username: '', posts: []});
    readonly userSource$ = this._userSource.asObservable();
    
    public getUsername = () => {
      return this._userSource.getValue().username
    }

    private _setUser = (userInfo: User) => {
      this._userSource.next(userInfo)
    }

    public fetchUsers = () => {
      return this._http
      .get<User>(`${this.LOCALPATH}/api/users/`)
      }

    public fetchUser = (username: string) => {
      this._http
      .get<User>(`${this.LOCALPATH}/api/users/${username}`)
      .subscribe(user => {
        this._setUser(user)
      });    
    }

}