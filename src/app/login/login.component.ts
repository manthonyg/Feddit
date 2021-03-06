import { Message } from "../models/message.model";
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MessagerService } from '../services/messager.service';
import { UserService } from "../services/user.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public isLoading: boolean = false;
  public form: FormGroup;
  private _alertMessage: Message;

  constructor(private messagerService: MessagerService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      username: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      }),
    });
  }


  handleLogin(): void {
    if (this.form.invalid) {
      this._alertMessage = {content: "Could not log in", type: "Error", duration: 3000}
      return this.messagerService.createMessage(this._alertMessage)
    }

    if (this.form.valid) {
      console.log('sending user info to the user service');
      this.userService.login({username: this.form.value.username, password: this.form.value.password})
      this.router.navigate(['/']);
    }
  }

}
