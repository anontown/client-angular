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

@Component({
  templateUrl: './clients.component.html',
})
export class ClientsPageComponent implements OnInit, OnDestroy {
  private clients: Immutable.List<IClientAPI> = null;

  constructor(public user: UserService, private api: AtApiService) {
  }

  add(client: IClientAPI) {
    this.clients.push(client);
  }

  async ngOnInit() {
    let ud=await this.user.ud.toPromise();
    if(ud){
      this.clients = Immutable.List(await this.api.findClientAll(ud.auth));
    }
  }

  ngOnDestroy() {
  }
}
