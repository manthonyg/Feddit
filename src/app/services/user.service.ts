import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Token } from "../models/token.model";
import { User } from '../models/user.model';
import { AuthData } from "../models/auth-data.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { MessagerService } from "./messager.service";
import { ThrowStmt } from "@angular/compiler";
@Injectable({providedIn: 'root'})
  export class UserService {

    constructor(
      private _http: HttpClient, 
      private router: Router, 
      private _messagerService: MessagerService
      ) {}
    private LOCALPATH = "http://localhost:3000"

    private readonly _userSource = new BehaviorSubject<User>({username: '', id: ''});
    readonly userSource$ = this._userSource.asObservable();
    
    private readonly _tokenSource = new BehaviorSubject<Token>({token: '', duration: 3000}); // seconds
    readonly tokenSource$ = this._tokenSource.asObservable();

    private readonly _logStatusSource = new BehaviorSubject<boolean>(false);
    readonly logStatusSource$ = this._logStatusSource.asObservable();

    private _tokenTimeout: any;

    public getUsername = () => {
      return this._userSource.getValue().username
    }

    private _setUser = (userInfo: User | null) => {
      this._userSource.next(userInfo);
    }

    private _setLogStatus = (logStatus: boolean) => {
      this._logStatusSource.next(logStatus);
    }

    private _setToken = (token: Token | null) => {
      this._tokenSource.next(token);
    }

    public getToken = () => {
      return this._tokenSource.getValue()
    }
    
    public createUser = (userInfo) => {
      return this._http
      .post<{username: string, _id: string}>(`${this.LOCALPATH}/api/user/register`, userInfo)
      .subscribe(user => {
        this._setUser({username: user.username, id: user._id})
        this.router.navigate(['/login'])
      })
    }

    public checkUserAuth() {
      const authInfo = this._getAuthData();
      if (!authInfo) {
        return
      }
      console.log(authInfo)
      const now = new Date();
      const isInFuture: boolean = authInfo.tokenDuration > now;

      if (isInFuture) {
        this._setUser({username: authInfo.username, id: authInfo.userId})
        this._setTokenTimeout(3000);
        this._setLogStatus(true)
      }
    }

    private _getAuthData() {
      const token = localStorage.getItem('token');
      const tokenDuration = localStorage.getItem('tokenDuration');
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');

      if (token && tokenDuration && userId && username) {
        return {token: token, tokenDuration: new Date(tokenDuration), userId: userId, username: username}
      }
    }

    private _saveAuthData(token: string, expirationDate: Date, user: {username: string, id: string}) {
      localStorage.setItem('token', token);
      localStorage.setItem('tokenDuration', expirationDate.toISOString());
      localStorage.setItem('userId', user.id)
      localStorage.setItem('username', user.username)
    }

    private _createExpirationDate(duration: number) {
      const now = new Date();
      return new Date(now.getTime() + duration * 10)
    }

    private _resetAuthData() {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenDuration');
      localStorage.removeItem('userId');
    }

    private _setTokenTimeout(duration: number) {
      this._tokenTimeout = setTimeout(() => {
        this.logout();
      }, duration)
    }

    public login = (userInfo) => {
      return this._http
      .post<{duration: number, token: string, user: {username: string, _id: string}}>(`${this.LOCALPATH}/api/user/login`, userInfo)
      .subscribe(response => {
        const {token, duration, user} = response
        this._setToken({token, duration});
        this._saveAuthData(token, this._createExpirationDate(duration), {username: user.username, id: user._id});
        this._setTokenTimeout(duration);
        this._setLogStatus(true);
        this._setUser({
          username: user.username,
          id: user._id
        });
      },
      error => {
        return this._messagerService.createMessage({content: "Bad credentials", type: "Error", duration: 3000})
      });
    }

    public logout = () => {
      clearTimeout(this._tokenTimeout)
      this._resetAuthData();
      this._setToken(null);
      this._setLogStatus(false);
      this._setUser(null)
      this.router.navigate(['/login']);
    }

    public fetchUser = (username: string) => {
      this._http
      .get<User>(`${this.LOCALPATH}/api/user/${username}`)
      .subscribe(user => {
        this._setUser(user)
      });    
    }

}