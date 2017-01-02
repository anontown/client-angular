import { Component,
   OnInit,
    Input, 
    OnDestroy ,
  ChangeDetectionStrategy} from '@angular/core';
import { Profile } from 'anontown';
import { IUserDataListener, UserService, IUserData } from '../services'

@Component({
  selector: 'at-profile',
  templateUrl: './profile.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class ProfileComponent implements OnInit, OnDestroy {
  @Input()
  profile: Profile;

  ud: IUserData;
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