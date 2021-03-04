import { Message } from "../models/message.model";
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MessagerService } from '../services/messager.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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
    });
  }


  handleLogin(): void {
    if (this.form.invalid) {
      this._alertMessage = {content: "Could not log in", type: "Error", duration: 3000}
      return this.messagerService.createMessage(this._alertMessage)
    }

    if (this.form.valid) {
      console.log(this.form.value.username, this.form.value.password)
    }
  }

}
