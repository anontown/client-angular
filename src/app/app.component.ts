import {
  Component,
  HostListener,
  OnInit,
  OnDestroy
} from '@angular/core';
import { AtApiService, IAuthToken } from 'anontown';
import { UserService, IUserData, IUserDataListener } from './services';
import { Config } from './config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  ud: IUserData;
  private udListener: IUserDataListener;

  constructor(private user: UserService,
    private api: AtApiService,
    public router: Router) {
    setInterval(() => this.save(), 30 * 1000);
  }

  async ngOnInit() {
    // トークンリクエスト
    this.router.events.take(1).subscribe(async e => {
      await (async () => {
        let params = this.router.parseUrl(e.url).queryParams;
        let id = params['id'];
        let key = params['key'];
        if (id && key) {
          let token = await this.api.findTokenReq({
            id,
            key
          });

          localStorage.setItem('token', JSON.stringify({
            id: token.id,
            key: token.key
          }));
        }
      })().catch(_e => {
        // トークンリクエスト→トークンの変換失敗
      });

      // 認証
      await (async () => {
        let json = localStorage.getItem('token');
        if (json) {
          let auth: IAuthToken = JSON.parse(json);
          let token = await this.api.findTokenOne(auth);
          await this.user.login(token);
        } else {
          this.user.setUserData(null);
        }
      })().catch(_e => {
        this.user.setUserData(null);
      });
    });

    this.udListener = this.user.addUserDataListener(ud => {
      this.ud = ud;
    });
  }

  ngOnDestroy() {
    this.user.removeUserDataListener(this.udListener);
  }

  login() {
    location.href = Config.userURL + '/auth?client=' + Config.clientID;
  }

  logout() {
    this.user.setUserData(null);
    localStorage.removeItem('token');
  }

  @HostListener('window:beforeunload')
  beforeUnloadHander() {
    this.save();
    return 'ページを移動しますか？';
  }

  async save() {
    if (this.ud !== null) {
      this.api.setTokenStorage(this.ud.auth, {
        value: this.ud.storage.toJSON()
      });
    }
  }
}
