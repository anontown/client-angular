import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  UserService,
  AtApiService,
  IClientAPI
} from '../../services';
import * as Immutable from 'immutable';


@Component({
  templateUrl: './apps-setting.component.html',
  styleUrls: ['./apps-setting.component.scss']
})
export class AppsSettingPageComponent implements OnInit, OnDestroy {
  private clients: Immutable.List<IClientAPI>;

  constructor(public user: UserService, private api: AtApiService) {

  }
  async ngOnInit() {
    let ud = await this.user.ud.take(1).toPromise();
    this.clients = Immutable.List(await this.api.findTokenClientAll(ud!.auth));
  }

  ngOnDestroy() {
  }

  async del(id: string) {
    await this.api.deleteTokenClient(this.user.ud.getValue()!.auth, { client: id });
    this.clients=this.clients.remove(this.clients.findIndex(c=>c!.id===id));
  }
}
