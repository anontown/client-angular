import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { AtApiService, AtError, IAuthUser, IAtError, UserService } from '../../services';
import { Config } from '../../config';
import { ReCaptchaComponent } from 'angular2-recaptcha/lib/captcha.component';


@Component({
  templateUrl: './in.component.html'
})
export class InPageComponent {
  private sn = "";
  private pass = "";
  private isLogin = true;
  private errors: IAtError[] = [];
  siteKey = Config.recaptcha;

  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  constructor(public user: UserService,
    private api: AtApiService) { }

  async ok() {
    try {
      let id: string;
      if (!this.isLogin) {
        let user = await this.api.createUser(this.captcha.getResponse() as string,
          {
            sn: this.sn,
            pass: this.pass
          });
        id = user.id;
      } else {
        id = await this.api.findUserID({ sn: this.sn });
      }

      this.user.login(await this.api.createTokenMaster({ id, pass: this.pass }));
    } catch (e) {
      if (this.captcha) {
        this.captcha.reset();
      }
      if (e instanceof AtError) {
        this.errors = e.errors;
      } else {
        throw e;
      }
    }
  }
}
