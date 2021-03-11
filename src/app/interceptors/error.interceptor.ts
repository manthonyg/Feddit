import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessagerService } from '../services/messager.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private messagerService: MessagerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.messagerService.createMessage({ content: error.error.message, type: 'Error', duration: 3000 });
        return throwError(error);
      })
    );
  }
}
