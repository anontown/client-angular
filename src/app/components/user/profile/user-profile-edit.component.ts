import { Component, OnInit, Input } from '@angular/core';
import {
    AtApiService,
    Profile,
    AtError
} from 'anontown';
import { UserDataService } from '../../../services';

@Component({
    selector: 'at-user-profile-edit',
    templateUrl: './user-profile-edit.component.html'
})
export class UserProfileEditComponent extends OnInit {
    @Input()
    private profile: Profile;

    private isEdit = false;

    private name = "";
    private text = "";
    private errorMsg: string | null = null;

    constructor(private ud: UserDataService,
        private api: AtApiService) {
        super();
    }

    ngOnInit() {
        this.name = this.profile.name;
        this.text = this.profile.text;
    }

    ok() {
        (async () => {
            let profile = await this.api.updateProfile(await this.ud.auth, {
                id: this.profile.id,
                name: this.name,
                text: this.text
            });
            this.errorMsg = null;

            //プロフィール更新
            let profiles = await this.ud.profiles;
            profiles[profiles.indexOf(this.profile)] = profile;
            this.profile = profile;
            this.ngOnInit();
        })().catch(e => {
            if (e instanceof AtError) {
                this.errorMsg = e.message;
            } else {
                throw e;
            }
        });
    }

    edit() {
        this.isEdit = !this.isEdit;
    }
}