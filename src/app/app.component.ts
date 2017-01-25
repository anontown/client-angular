import {
  Component,
  HostListener,
  OnInit,
  OnDestroy
} from '@angular/core';
import { AtApiService, IAuthToken } from 'anontown';
import { UserService } from './services';
import { Config } from './config';
import { Router } from '@angular/router';
import {MdSnackBar} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private user: UserService,
    private api: AtApiService,
    public router: Router,
    public snackBar: MdSnackBar) {
    setInterval(() => this.save(), 30 * 1000);
  }

  async ngOnInit() {
    // トークンリクエスト
    this.router.events.take(1).subscribe(async e => {
      try{
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
      }catch(_e){
        this.snackBar.open("トークン取得に失敗");
      }

      // 認証
      try{
        let json = localStorage.getItem('token');
        if (json) {
          let auth: IAuthToken = JSON.parse(json);
          let token = await this.api.findTokenOne(auth);
          await this.user.login(token);
        } else {
          this.user.setUserData(null);
        }
      }catch(_e){
        this.snackBar.open("認証に失敗");
        this.user.setUserData(null);
      }
    });
  }

  ngOnDestroy() {
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
    if (this.user.ud !== null) {
      try{
        await this.api.setTokenStorage(this.user.ud.auth, {
          value: this.user.ud.storage.toJSON()
        });
      }catch(_e){
        this.snackBar.open("お気に入りなどのデータ保存に失敗");
      }
    }
  }
}
