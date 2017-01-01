import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Profile } from 'anontown';
import { IUserDataListener, UserService, IUserData } from '../services'

@Component({
  selector: 'at-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {
  @Input()
  profile: Profile;

  ud: IUserData = null;
  private udListener: IUserDataListener;

  constructor(private user: UserService) {
  }

  ngOnInit() {
    this.udListener = this.user.addUserDataListener(ud => {
      this.ud = ud;
    })
  }

  ngOnDestroy() {
    this.user.removeUserDataListener(this.udListener);
  }
}