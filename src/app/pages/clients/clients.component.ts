import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { UserService, IAuthListener } from '../services/user.service';
import {
  Client,
  IAuthUser,
  AtApiService
} from 'anontown';
import * as Immutable from 'immutable';

@Component({
  templateUrl: './clients.component.html',
})
export class ClientsPageComponent implements OnInit, OnDestroy {
  private auth: IAuthUser = null;
  private clients: Immutable.List<Client> = null;

  constructor(public user: UserService, private api: AtApiService) {
  }

  update(client: Client) {
    this.clients = this.clients.set(this.clients.findIndex((c) => c.id === client.id), client)
  }

  add(client: Client) {
    this.clients.push(client);
  }

  private authListener: IAuthListener;

  ngOnInit() {
    this.authListener = this.user.addAuthListener(async auth => {
      if (auth !== null) {
        this.auth = auth;
        this.clients = Immutable.List(await this.api.findClientAll(this.auth));
      } else {
        this.auth = null;
        this.clients = null;
      }
    });
  }

  ngOnDestroy() {
    this.user.removeAuthListener(this.authListener);
  }
}
