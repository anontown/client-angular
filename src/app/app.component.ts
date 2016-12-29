import {
    Component,
    HostListener,
    OnInit
} from '@angular/core';
import { AtApiService } from 'anontown';
import { UserDataService } from './services';
import { Config } from './config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private ud: UserDataService,
        private api: AtApiService) {
        setInterval(() => this.save(), 30 * 1000);
    }

    ngOnInit() {
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
