import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router
    ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
  if (this.userService.getToken()) {
    return true
  }
  else {
    this.router.navigate(['/login'])
  }
 }
}