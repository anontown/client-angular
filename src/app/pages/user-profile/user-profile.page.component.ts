import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { UserService } from '../../services';
import { Profile } from 'anontown';
@Component({
  templateUrl: './user-profile.page.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class UserProfilePageComponent implements OnInit, OnDestroy {
  constructor(private user: UserService) {
  }

  ngOnInit() {
    document.title="プロフィール管理"
  }

  ngOnDestroy() {
  }

  update(pr: Profile) {
    this.user.ud.profiles = this.user.ud.profiles.set(this.user.ud.profiles.findIndex(p => p.id === pr.id), pr);
    this.user.updateUserData();
  }

  add(p: Profile) {
    this.user.ud.profiles = this.user.ud.profiles.push(p);
    this.user.updateUserData();
  }
}