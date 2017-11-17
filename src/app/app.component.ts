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
import { MatSnackBar } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { toJSON } from './storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  get isDarkTheme(): boolean {
    return document.body.classList.contains('app-dark-theme');
  }

  set isDarkTheme(value: boolean) {
    switch (value) {
      case true:
        localStorage.setItem('theme', 'dark');
        document.body.classList.add('app-dark-theme');
        this.overlayContainer.getContainerElement().classList.add('app-dark-theme');
        break;
      case false:
        localStorage.setItem('theme', 'light');
        document.body.classList.remove('app-dark-theme');
        this.overlayContainer.getContainerElement().classList.remove('app-dark-theme');
        break;
    }
  }

  constructor(public user: UserService,
    private api: AtApiService,
    public router: Router,
    public snackBar: MatSnackBar,
    public overlayContainer: OverlayContainer) {
    setInterval(() => this.save(), 10 * 1000);
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
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
        let json = toJSON(ud.storage);
        await this.api.setTokenStorage(ud.auth, {
          name: json.ver,
          value: JSON.stringify(json)
        });
      } catch (_e) {
        this.snackBar.open('お気に入りなどのデータ保存に失敗');
      }
    }
  }
}
