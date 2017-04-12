import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import { AtApiService, AtError, IAuthUser,IAtError } from 'anontown';
import { UserService, IAuthListener } from '../services/user.service';


@Component({
    templateUrl: './user-setting.component.html',
})
export class UserSettingPageComponent implements OnInit, OnDestroy {
    private auth: IAuthUser = null;
    pass: string = "";
    sn: string = "";
    private errors: IAtError[] = [];

    constructor(private user: UserService, private api: AtApiService) {
    }

    private authListener: IAuthListener;
    ngOnInit() {
        this.authListener = this.user.addAuthListener(async (auth, sn) => {
            this.auth = auth;
            if (auth !== null) {
                this.pass = auth.pass;
                this.sn = sn;
            }
        });
    }
    ngOnDestroy() {
        this.user.removeAuthListener(this.authListener);
    }

    ok() {
        (async () => {
            await this.api.updateUser(this.auth, { pass: this.pass, sn: this.sn });
            await this.user.setAuth({ id: this.auth.id, pass: this.pass }, this.sn);
            this.errors = [];
        })().catch(e => {
            if (e instanceof AtError) {
                this.errors = e.errors;
            } else {
                throw e;
            }
        });
    }
}
