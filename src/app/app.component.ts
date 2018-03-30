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
import { Router, RouterEvent } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { toJSON } from './storage';
import { gaID } from "./config";
import "rxjs/add/operator/distinctUntilChanged";


declare const gtag: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  get isDarkTheme(): boolean {
    return document.getElementById('p2rfix').classList.contains('app-dark-theme');
  }

  set isDarkTheme(value: boolean) {
    switch (value) {
      case true:
        localStorage.setItem('theme', 'dark');
        document.getElementById('p2rfix').classList.add('app-dark-theme');
        this.overlayContainer.getContainerElement().classList.add('app-dark-theme');
        break;
      case false:
        localStorage.setItem('theme', 'light');
        document.getElementById('p2rfix').classList.remove('app-dark-theme');
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
    this.router.events
      .filter(e => e instanceof RouterEvent)
      .map(e => (e as RouterEvent).url)
      .map(path => new URL("https://host" + path).pathname)
      .distinctUntilChanged()
      .subscribe(path => {
        console.log("ga", path);
        gtag('config', gaID, {
          page_path: path
        });
      });
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
      this.snackBar.open('認証に失敗', "OK", { duration: 5000 });
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
        this.snackBar.open('お気に入りなどのデータ保存に失敗', "OK", { duration: 5000 });
      }
    }
  }
}
