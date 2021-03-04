import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms'
import { MessagerService } from "../services/messager.service";
import { Message } from "../models/message.model";
import { checkPasswords } from "../validators/password-match.validator";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public isLoading: boolean = false;
  public form: FormGroup;
  private _alertMessage: Message;

  constructor(private messagerService: MessagerService) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      username: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      passwordConfirm: new FormControl(null, {
        validators: [Validators.required]
      }),
    });
  }



  handleRegister(): void {
    if (this.form.invalid) {
      this._alertMessage = {content: "Could not register", type: "Error", duration: 3000}
      return this.messagerService.createMessage(this._alertMessage)
    }

    if (this.form.valid) {
      console.log(this.form.value.username, this.form.value.password, 'successfully registered')
    }
  }

}
