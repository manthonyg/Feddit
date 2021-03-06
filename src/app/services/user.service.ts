import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from '../models/user.model';
import { AuthData } from "../models/auth-data.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
@Injectable({providedIn: 'root'})
  export class UserService {

    constructor(private _http: HttpClient, private router: Router) {}
    private LOCALPATH = "http://localhost:3000"

    private readonly _userSource = new BehaviorSubject<User>({username: '', posts: []});
    readonly userSource$ = this._userSource.asObservable();
    
    public getUsername = () => {
      return this._userSource.getValue().username
    }

    private _setUser = (userInfo: User) => {
      this._userSource.next(userInfo)
    }
    
    public createUser = (userInfo) => {
      return this._http
      .post<AuthData>(`${this.LOCALPATH}/api/user/register`, userInfo)
      .subscribe(user => {
        this._setUser({username: user.username, posts: []})
        this.router.navigate(['/'])
      })
    }

    public login = (userInfo: AuthData) => {
      return this._http
      .post<string>(`${this.LOCALPATH}/api/user/login`, userInfo)
      .subscribe(token => {
        localStorage.setItem('token', token['token'])
        console.log(token, 'was set in LS');
      });
    }

    public fetchUser = (username: string) => {
      this._http
      .get<User>(`${this.LOCALPATH}/api/user/${username}`)
      .subscribe(user => {
        this._setUser(user)
      });    
    }

}