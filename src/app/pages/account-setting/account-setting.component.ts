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
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './account-setting.component.html',
})
export class AccountSettingPageComponent implements OnInit, OnDestroy {
  newPass = "";
  oldPass = "";
  sn = "";
  private errors: IAtError[] = [];

  constructor(public user: UserService,
    private api: AtApiService,
    private titleService: Title) {
  }

  async ngOnInit() {
    this.titleService.setTitle("アカウント設定");
    let ud = await this.user.ud.take(1).toPromise();
    this.sn = await this.api.findUserSN({ id: ud!.token.user });
  }
  ngOnDestroy() {
  }

  async ok() {
    let ud = this.user.ud.getValue() !;
    let auth = {
      id: ud.token.user,
      pass: this.oldPass
    };
    try {
      await this.api.updateUser(auth, {
        pass: this.newPass,
        sn: this.sn
      });
      let newToken = await this.api.createTokenMaster({
        id: ud.token.user,
        pass: this.newPass
      });
      this.user.login(newToken);
      localStorage.setItem('token', JSON.stringify({
        id: newToken.id,
        key: newToken.key
      }));
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
