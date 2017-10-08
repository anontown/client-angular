import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  UserService,
  AtApiService,
  IAuthToken
} from './services';
import { Router } from '@angular/router';
import { MdSnackBar, OverlayContainer } from '@angular/material';

declare const CoinHive: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isCoinHive = localStorage.getItem('iscoinhive') === 'true';
  coinhive = new CoinHive.Anonymous('Zo2rps5kYDux3cSlc7viocgxGvTveti4');
  changeCoinHive() {
    if (this.isCoinHive) {
      //無効にする
      this.isCoinHive = false;
      localStorage.setItem('iscoinhive', 'false');
      this.coinhive.stop();
      console.log("マイニング停止");
    } else {
      //有効にする
      this.isCoinHive = true;
      localStorage.setItem('iscoinhive', 'true');
      this.coinhive.start();
      console.log("マイニング開始");
    }
  }

  get isDarkTheme(): boolean {
    return document.body.classList.contains('app-dark-theme');
  }

  set isDarkTheme(value: boolean) {
    switch (value) {
      case true:
        localStorage.setItem('theme', 'dark');
        document.body.classList.add('app-dark-theme');
        this.overlayContainer.themeClass = 'app-dark-theme';
        break;
      case false:
        localStorage.setItem('theme', 'light');
        document.body.classList.remove('app-dark-theme');
        this.overlayContainer.themeClass = '';
        break;
    }
  }

  constructor(public user: UserService,
    private api: AtApiService,
    public router: Router,
    public snackBar: MdSnackBar,
    private overlayContainer: OverlayContainer) {
    setInterval(() => this.save(), 30 * 1000);
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    if (this.isCoinHive) {
      this.coinhive.start();
      console.log("マイニング開始");
    }
  }

  changeTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }

  async ngOnInit() {
    // 認証
    try {
      let json = localStorage.getItem('token');
      if (json) {
        let auth: IAuthToken = JSON.parse(json);
        let token = await this.api.findTokenOne(auth);
        await this.user.login(token);
      } else {
        this.user.ud.next(null);
      }
    } catch (_e) {
      this.snackBar.open('認証に失敗');
      this.user.ud.next(null);
    }
  }

  ngOnDestroy() {
  }

  logout() {
    this.user.ud.next(null);
    localStorage.removeItem('token');
  }

  async save() {
    let ud = this.user.ud.getValue();
    if (ud !== null) {
      try {
        await this.api.setTokenStorage(ud.auth, {
          name: 'main',
          value: ud.storage.toJSON()
        });
      } catch (_e) {
        this.snackBar.open('お気に入りなどのデータ保存に失敗');
      }
    }
  }
}
