import { Component, EventEmitter, Output, Input } from '@angular/core';
import {
  AtApiService,
  AtError,
  IClientAPI,
  IAuthUser,
  IAtError,
  UserService
} from '../../services';


@Component({
  selector: 'app-client-add',
  templateUrl: './client-add.component.html',
})
export class ClientAddComponent {
  private url = "";
  private name = "";
  private errors: IAtError[] = [];

  @Output()
  add = new EventEmitter<IClientAPI>();

  constructor(public user: UserService,
    private api: AtApiService) {

  }

  async ok() {
    let ud = this.user.ud.getValue();
    try {
      let client = await this.api.createClient(ud.auth, {
        name: this.name,
        url: this.url
      });
      this.add.emit(client);
      this.errors = [];
    } catch (e) {
      if (e instanceof AtError) {
        this.errors = e.errors;
      } else {
        throw e;
      }
    }
  }
}
