import {
  Component,
  HostListener,
  OnInit,
  OnDestroy
} from '@angular/core';
import { UserService, AtApiService, IAuthToken } from './services';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(public user: UserService,
    private api: AtApiService,
    public router: Router,
    public snackBar: MdSnackBar) {
    setInterval(() => this.save(), 30 * 1000);
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
      this.snackBar.open("認証に失敗");
      this.user.ud.next(null);
    }
  }

  ngOnDestroy() {
  }

  logout() {
    this.user.ud.next(null);
    localStorage.removeItem('token');
  }

  @HostListener('window:beforeunload')
  beforeUnloadHander() {
    this.save();
    return 'ページを移動しますか？';
  }

  async save() {
    let ud = this.user.ud.getValue();
    if (ud !== null) {
      try {
        await this.api.setTokenStorage(ud.auth, {
          name: "main",
          value: ud.storage.toJSON()
        });
      } catch (_e) {
        this.snackBar.open("お気に入りなどのデータ保存に失敗");
      }
    }
  }
}
