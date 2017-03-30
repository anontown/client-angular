import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { UserService } from '../../services';
import { Profile } from 'anontown';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './user-profile.page.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class UserProfilePageComponent implements OnInit, OnDestroy {
  constructor(public user: UserService,
  private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle("プロフィール管理");
  }

  ngOnDestroy() {
  }

  update(pr: Profile) {
    let ud=this.user.ud.getValue();
    ud.profiles = ud.profiles.set(ud.profiles.findIndex(p => p.id === pr.id), pr);
    this.user.ud.next(ud);
  }

  add(p: Profile) {
    let ud=this.user.ud.getValue();
    ud.profiles = ud.profiles.push(p);
    this.user.ud.next(ud);
  }
}