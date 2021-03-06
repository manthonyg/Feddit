import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";

export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // check the users ls for the token
    const token = localStorage.getItem('token');
    // make a deep copy of the request so we dont mutate the orignal one
    // and attach new headers w the token
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', "Bearer" + " " + token)
    });
    return next.handle(authRequest);
  }
}