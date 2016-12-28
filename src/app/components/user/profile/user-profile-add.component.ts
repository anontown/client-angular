import { Component } from '@angular/core';
import {
    AtApiService,
    AtError
} from 'anontown';
import { UserDataService } from '../../../services';


@Component({
    selector: 'at-user-profile-add',
    templateUrl:'./user-profile-add.component.html'
})
export class UserProfileAddComponent {
    private name = "";
    private text = "";
    private errorMsg: string | null = null;

    constructor(private ud: UserDataService, private api: AtApiService) {
    }

    ok() {
        (async () => {
            let p = await this.api.createProfile(await this.ud.auth, {
                name: this.name,
                text: this.text
            });

            this.name = "";
            this.text = "";
            (await this.ud.profiles).push(p);
        })().catch(e => {
            if (e instanceof AtError) {
                this.errorMsg = e.message;
            } else {
                throw e;
            }
        });

    }
}