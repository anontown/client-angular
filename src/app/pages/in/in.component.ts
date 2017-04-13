import { Component, ViewChild } from '@angular/core';
import { AtApiService, AtError, IAtError, UserService } from '../../services';
import { Config } from '../../config';
import { ReCaptchaComponent } from 'angular2-recaptcha/lib/captcha.component';
import { Router } from '@angular/router';

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
    private api: AtApiService,
    private router:Router) { }

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

      let token = await this.api.createTokenMaster({ id, pass: this.pass })
      this.user.login(token);
      localStorage.setItem('token', JSON.stringify({
        id: token.id,
        key: token.key
      }));
      this.router.navigate(['/']);
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
