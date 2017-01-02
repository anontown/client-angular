import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Output,
    EventEmitter, ChangeDetectionStrategy
} from '@angular/core';
import {
    AtApiService,
    Profile,
    AtError,
} from 'anontown';
import { UserService, IUserDataListener, IUserData } from '../../services';

@Component({
    selector: 'at-user-profile-edit',
    templateUrl: './user-profile-edit.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class UserProfileEditComponent implements OnInit, OnDestroy {
    @Input()
    private profile: Profile;

    private isEdit = false;

    private name = "";
    private text = "";
    private errorMsg: string | null = null;

    constructor(private user: UserService,
        private api: AtApiService) {
    }

    ud: IUserData;
    udListener: IUserDataListener;

    @Output()
    update = new EventEmitter<Profile>();

    ngOnInit() {
        this.name = this.profile.name;
        this.text = this.profile.text;
        this.udListener = this.user.addUserDataListener((ud) => {
            this.ud = ud;
        })
    }

    ngOnDestroy() {
        this.user.removeUserDataListener(this.udListener);
    }

    ok() {
        (async () => {
            let profile = await this.api.updateProfile(this.ud.auth, {
                id: this.profile.id,
                name: this.name,
                text: this.text
            });
            this.errorMsg = null;

            //プロフィール更新
            this.update.emit(profile);
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