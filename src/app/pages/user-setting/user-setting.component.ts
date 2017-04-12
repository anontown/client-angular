import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  UserService,
  AtApiService,
  AtError,
  IAtError
} from '../../services';


@Component({
  templateUrl: './user-setting.component.html',
})
export class UserSettingPageComponent implements OnInit, OnDestroy {
  newPass = "";
  oldPass = "";
  sn = "";
  private errors: IAtError[] = [];

  constructor(private user: UserService, private api: AtApiService) {
  }

  async ngOnInit() {
    let ud = await this.user.ud.toPromise();
    this.sn = await this.api.findUserSN({ id: ud.token.user });
  }
  ngOnDestroy() {
  }

  async ok() {
    let ud = this.user.ud.getValue();
    let auth = {
      id: ud.token.user,
      pass: this.oldPass
    };
    try {
      await this.api.updateUser(auth, {
        pass: this.newPass,
        sn: this.sn
      });
      this.user.login(await this.api.createTokenMaster(auth));
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
