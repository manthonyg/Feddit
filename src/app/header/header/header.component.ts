import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from "../../services/user.service";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private userService: UserService) { }

  public currentUser = null;
  public token = null;

  ngOnInit(): void {
    this.userService.userSource$
    .subscribe(user => {
      this.currentUser = user
    })

    this.userService.tokenSource$
    .subscribe(token => {
      console.log(token)
      this.token = token
    });
  };


  handleLogout = () => {
    // clear ls
    localStorage.clear()

    // reset the token inside of the service
    this.userService.logout()
  }
}
