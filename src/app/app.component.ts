import {
    Component,
    HostListener,
    ViewChild,
    ElementRef,
    OnInit
} from '@angular/core';
import { AtApiService, AtConfig } from 'anontown';
import { UserDataService } from './services';
var $ = require('jquery');

@Component({
    selector: 'app-root',
    template: `
        <nav class="navbar navbar-default navbar-fixed-top" (window:resize)="resize()" #nav>
            <div class="container">
                <div class="navbar-header">
                    <a [routerLink]="['/']" class="navbar-brand">Anontown</a>
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar" id="navbar-toggle">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                </div>
                <div id="navbar" class="navbar-collapse collapse">
                    <ul class="nav navbar-nav">
                        <li *ngIf="ud.isToken|async">
                            <a [routerLink]="['/favo']">お気に入り</a>
                        </li>
                        <li>
                            <a [routerLink]="['/topic/search']" [queryParams]="{title:'',category:''}">検索</a>
                        </li>
                        <li *ngIf="ud.isToken|async">
                            <a [routerLink]="['/topic/write']">新規トピック</a>
                        </li>
                        <li *ngIf="ud.isToken|async">
                            <a [routerLink]="['/user/notice']">通知</a>
                        </li>
                        <li *ngIf="ud.isToken|async">
                            <a [routerLink]="['/user/profile']">プロフ管理</a>
                        </li>
                        <li *ngIf="ud.isToken|async">
                            <a [routerLink]="['/user/msg']">お知らせ</a>
                        </li>
                    </ul>
                    <button *ngIf="ud.notToken|async" type="button" (click)="login()" class="btn btn-default navbar-btn navbar-right">ログイン</button>
                    <button *ngIf="ud.isToken|async" type="button" (click)="logout()" class="btn btn-default navbar-btn navbar-right">ログアウト</button>
                </div>
            </div>
        </nav>
        <template ngbModalContainer></template>
        <router-outlet></router-outlet>
    `
})
export class AppComponent implements OnInit {
    @ViewChild('nav') nav: ElementRef;
    resize() {
        document.body.style.paddingTop = this.nav.nativeElement.clientHeight + 20 + "px";
    }
    constructor(private ud: UserDataService,
        private api: AtApiService) {
        setInterval(() => this.save(), 30 * 1000);
    }

    ngOnInit() {
        this.resize();
    }

    ngAfterViewInit() {
        $(".navbar-collapse").on("click", "a", function () {
            //画面サイズがxsなら
            if (window.innerWidth < 768) {
                $("#navbar-toggle").click();
            }
        });
    }

    login() {
        location.href = AtConfig.userURL + "/auth?client=" + AtConfig.clientID;
    }

    logout() {
        this.ud.logout();
    }

    @HostListener('window:beforeunload')
    beforeUnloadHander() {
        this.save();
        return "ページを移動しますか？";
    }

    async save() {
        if (await this.ud.isToken) {
            this.api.setTokenStorage(await this.ud.auth, {
                value: (await this.ud.storage).toJSON()
            });
        }
    }
}
