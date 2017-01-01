import {
    Component,
    HostListener,
    OnInit,
    OnDestroy
} from '@angular/core';
import { AtApiService,IAuthToken } from 'anontown';
import { UserService, IUserData, IUserDataListener } from './services';
import { Config } from './config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    constructor(private user: UserService,
        private api: AtApiService) {
        setInterval(() => this.save(), 30 * 1000);
    }

    ud: IUserData = null;
    private udListener: IUserDataListener;

    async ngOnInit() {
        let json=localStorage.getItem("token");
        if(json){
            let auth:IAuthToken=JSON.parse(json);
            let token=await this.api.findTokenOne(auth);
            await this.user.login(token);
        }

        this.udListener = this.user.addUserDataListener(ud => {
            this.ud = ud;
        });
    }

    ngOnDestroy() {
        this.user.removeUserDataListener(this.udListener);
    }

    login() {
        location.href = Config.userURL + "/auth?client=" + Config.clientID;
    }

    logout() {
        this.user.setUserData(null);
        localStorage.removeItem("token");
    }

    @HostListener('window:beforeunload')
    beforeUnloadHander() {
        this.save();
        return "ページを移動しますか？";
    }

    async save() {
        if (this.ud !== null) {
            this.api.setTokenStorage(this.ud.auth, {
                value: this.ud.storage.toJSON()
            });
        }
    }
}
