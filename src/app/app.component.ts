import {
    Component,
    HostListener,
    ViewChild,
    ElementRef,
    OnInit
} from '@angular/core';
import { AtApiService } from 'anontown';
import { UserDataService } from './services';
import { Config } from './config';
var $ = require('jquery');

@Component({
    selector: 'app-root',
    templateUrl:'./app.component.html'
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
        location.href = Config.userURL + "/auth?client=" + Config.clientID;
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
