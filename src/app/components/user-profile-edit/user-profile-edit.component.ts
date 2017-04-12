import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Output,
    EventEmitter, ChangeDetectionStrategy
} from '@angular/core';

import {
    UserService,
    AtApiService,
    IProfileAPI,
    AtError,
    IAtError
} from '../../services';

@Component({
    selector: 'app-user-profile-edit',
    templateUrl: './user-profile-edit.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class UserProfileEditComponent implements OnInit, OnDestroy {
    @Input()
    private profile: IProfileAPI;

    private isEdit = false;

    private name = "";
    private text = "";
    sn = "";
    private errors: IAtError[] = [];

    constructor(public user: UserService,
        private api: AtApiService) {
    }

    @Output()
    update = new EventEmitter<IProfileAPI>();

    ngOnInit() {
        this.sn = this.profile.sn;
        this.name = this.profile.name;
        this.text = this.profile.text;
    }

    ngOnDestroy() {
    }

    async ok() {
        let ud = this.user.ud.getValue();
        try {
            let profile = await this.api.updateProfile(ud.auth, {
                id: this.profile.id,
                name: this.name,
                text: this.text,
                sn: this.sn
            });
            this.errors = [];

            //プロフィール更新
            this.update.emit(profile);
        } catch (e) {
            if (e instanceof AtError) {
                this.errors = e.errors;
            } else {
                throw e;
            }
        }
    }

    edit() {
        this.isEdit = !this.isEdit;
    }
}