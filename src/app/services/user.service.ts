import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Token } from "../models/token.model";
import { User } from '../models/user.model';
import { AuthData } from "../models/auth-data.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { MessagerService } from "./messager.service";
@Injectable({providedIn: 'root'})
  export class UserService {

    constructor(private _http: HttpClient, private router: Router, private messagerService: MessagerService) {}
    private LOCALPATH = "http://localhost:3000"

    private readonly _userSource = new BehaviorSubject<User>({username: '', posts: []});
    readonly userSource$ = this._userSource.asObservable();
    
    private readonly _tokenSource = new BehaviorSubject<Token>({token: '', duration: 3000}); // seconds
    readonly tokenSource$ = this._tokenSource.asObservable();

    private _tokenTimeout: any;

    public getUsername = () => {
      return this._userSource.getValue().username
    }

    private _setUser = (userInfo: User) => {
      this._userSource.next(userInfo);
    }

    private _setToken = (token: Token) => {
      this._tokenSource.next(token);
    }

    public getToken = () => {
      return this._tokenSource.getValue()
    }
    
    public createUser = (userInfo) => {
      return this._http
      .post<AuthData>(`${this.LOCALPATH}/api/user/register`, userInfo)
      .subscribe(user => {
        this._setUser({username: user.username, posts: []})
        this.router.navigate(['/login'])
      })
    }

    public login = (userInfo) => {

      return this._http
      .post<Token>(`${this.LOCALPATH}/api/user/login`, userInfo)
      .subscribe(token => {
        this._setToken(token);
        localStorage.setItem('token', token['token']);
        localStorage.setItem('tokenDuration', String(token['duration']));

        this._tokenTimeout = setTimeout(() => {
          this.logout();
          this.router.navigate(['/login']);
        }, token['duration'])

      });

      
    }

    public logout = () => {
      clearTimeout(this._tokenTimeout)
      this._setToken(null);
      this.router.navigate(['/']);
    }

    public fetchUser = (username: string) => {
      this._http
      .get<User>(`${this.LOCALPATH}/api/user/${username}`)
      .subscribe(user => {
        this._setUser(user)
      });    
    }

}