import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  UserService,
  IClientAPI,
  AtApiService
} from '../../services';
import * as Immutable from 'immutable';
import { Title } from '@angular/platform-browser';
@Component({
  templateUrl: './dev-setting.component.html',
  selector: 'app-page-dev-setting'
})
export class DevSettingPageComponent implements OnInit, OnDestroy {
  private clients = Immutable.List<IClientAPI>();

  constructor(public user: UserService,
    private api: AtApiService,
    private titleService: Title) {
  }

  add(client: IClientAPI) {
    this.clients.push(client);
  }

  async ngOnInit() {
    this.titleService.setTitle('クライアント管理');
    let ud = await this.user.ud.take(1).toPromise();
    if (ud) {
      this.clients = Immutable.List(await this.api.findClientAll(ud.auth));
    }
  }

  ngOnDestroy() {
  }
}
