import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Token } from '../../models/token.model';
import { MessagerService } from 'src/app/services/messager.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private userService: UserService, private messagerService: MessagerService) {}

  public currentUser = null;
  public token: Token = null;
  public isLoggedIn = false;

  ngOnInit(): void {
    this.userService.checkUserAuth();

    this.userService.userSource$.subscribe((user) => {
      console.log(user);
      this.currentUser = user;
    });

    this.userService.logStatusSource$.subscribe(
      (newLogStatus) => {
        if (newLogStatus === false && this.isLoggedIn === true) {
          this.messagerService.createMessage({ content: 'Logged out', type: 'Success', duration: 1500 });
        } else if (newLogStatus === true && this.isLoggedIn === false) {
          this.messagerService.createMessage({ content: `Logged in`, type: 'Success', duration: 1500 });
        }
        this.isLoggedIn = newLogStatus;
      },
      (error) => {
        return this.messagerService.createMessage({ content: `Failed to log in`, type: 'Error', duration: 1500 });
      }
    );

    this.userService.tokenSource$.subscribe((token) => {
      console.log(token);
      this.token = token;
    });
  }

  handleLogout = () => {
    // reset the token inside of the service
    this.userService.logout();
  };
}
