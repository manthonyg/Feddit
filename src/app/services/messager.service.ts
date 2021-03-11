import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Message } from '../models/message.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class MessagerService {
  constructor(private _snackBar: MatSnackBar) {}

  private readonly _messageSource = new BehaviorSubject<Message>({ type: null, content: null, duration: 5000 });
  readonly messageSource$ = this._messageSource.asObservable();

  public getMessage(): Message {
    return this._messageSource.getValue();
  }

  public _setMessage(message: Message): void {
    this._messageSource.next(message);
  }

  public createMessage(message: Message) {
    this._setMessage(message);
    this.openSnackBar();
  }

  public openSnackBar(): void {
    const message = this.getMessage();
    const snack = this._snackBar;

    snack.open(message.content, null, {
      ...this.createSnackbarConfig(message.type),
      duration: message.duration,
    });

    this.clearMessages();
  }

  public clearMessages(): void {
    this._setMessage({ type: null, content: null, duration: 500 });
  }

  public createSnackbarConfig(messageType: string): MatSnackBarConfig {
    const snackbarConfig = new MatSnackBarConfig();
    if (messageType === 'Success') {
      snackbarConfig.panelClass = ['snackbar-success'];
    } else if (messageType === 'Error') {
      snackbarConfig.panelClass = ['snackbar-error'];
    }
    return snackbarConfig;
  }
}
