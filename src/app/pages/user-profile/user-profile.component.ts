import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { UserService, IProfileAPI, AtApiService } from '../../services';
import { Title } from '@angular/platform-browser';
import * as Immutable from 'immutable';

@Component({
  templateUrl: './user-profile.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class UserProfilePageComponent implements OnInit, OnDestroy {
  profiles: Immutable.List<IProfileAPI>;

  constructor(private api: AtApiService,
    public user: UserService,
    private titleService: Title) {
  }

  async ngOnInit() {
    this.titleService.setTitle("プロフィール管理");
    let ud = await this.user.ud.toPromise();
    this.profiles = Immutable.List(await this.api.findProfileAll(ud!.auth));
  }

  ngOnDestroy() {
  }

  update(pr: IProfileAPI) {
    this.profiles = this.profiles.set(this.profiles.findIndex(p => p!.id === pr.id), pr);
  }

  add(p: IProfileAPI) {
    this.profiles = this.profiles.push(p);
  }
}