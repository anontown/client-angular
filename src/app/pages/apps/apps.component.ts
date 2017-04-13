import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  UserService,
  AtApiService,
  IClientAPI
} from '../../services';
import * as Immutable from 'immutable';


@Component({
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AppsPageComponent implements OnInit, OnDestroy {
  private clients: Immutable.List<IClientAPI>;

  constructor(private user: UserService, private api: AtApiService) {

  }
  async ngOnInit() {
    let ud = await this.user.ud.toPromise();
    this.clients = Immutable.List(await this.api.findTokenClientAll(ud.auth));
  }

  ngOnDestroy() {
  }

  async del(id: string) {
    await this.api.deleteTokenClient(this.user.ud.getValue().auth, { client: id });
    this.clients=this.clients.remove(this.clients.findIndex(c=>c.id===id));
  }
}
