import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import {
  AtApiService,
  IClientAPI,
  AtError,
  IAuthUser,
  IAtError,
  UserService
} from '../../services';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html'
})
export class ClientEditComponent implements OnInit {
  @Input()
  client: IClientAPI;

  @Output()
  update = new EventEmitter<IClientAPI>();

  constructor(public user: UserService,
    private api: AtApiService) {
  }

  name: string;
  url: string;
  errors: IAtError[] = [];
  ngOnInit() {
    this.name = this.client.name;
    this.url = this.client.url;
  }
  async ok() {
    let ud = this.user.ud.getValue();
    try {
      let client = await this.api.updateClient(ud.auth, {
        id: this.client.id,
        name: this.name,
        url: this.url
      });
      this.update.emit(client);
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
