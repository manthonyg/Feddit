import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms'
import { MessagerService } from "../services/messager.service";
import { Message } from "../models/message.model";
import { checkPasswords } from "../validators/password-match.validator";
import { AuthData } from "../models/auth-data.model";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public isLoading: boolean = false;
  public form: FormGroup;
  private _alertMessage: Message;

  constructor(
    private messagerService: MessagerService, 
    private userService: UserService, 
    private router: Router) { }

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



  handleRegister() {
    if (this.form.invalid) {
      this._alertMessage = {content: "Could not register", type: "Error", duration: 3000}
      return this.messagerService.createMessage(this._alertMessage)
    }

    if (this.form.valid) {
      const authData: AuthData = {username: this.form.value.username, password: this.form.value.password}
      try {
        this.userService.createUser(authData)
        this._alertMessage = {content: "Successfully registered. Please log in", type: "Success", duration: 3000};
        return this.messagerService.createMessage(this._alertMessage);
      }
      catch(error) {
        this._alertMessage = {content: "Could not register", type: "Error", duration: 3000};
        return this.messagerService.createMessage(this._alertMessage);
      }
    }
  }

}
