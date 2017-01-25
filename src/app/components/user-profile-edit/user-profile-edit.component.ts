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
import { UserService } from '../../services';

@Component({
    selector: 'app-user-profile-edit',
    templateUrl: './user-profile-edit.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class UserProfileEditComponent implements OnInit, OnDestroy {
    @Input()
    private profile: Profile;

    private isEdit = false;

    private name = "";
    private text = "";
    sn = "";
    private errorMsg: string | null = null;

    constructor(private user: UserService,
        private api: AtApiService) {
    }

    @Output()
    update = new EventEmitter<Profile>();

    ngOnInit() {
        this.sn = this.profile.sn;
        this.name = this.profile.name;
        this.text = this.profile.text;
    }

    ngOnDestroy() {
    }

    async ok() {
        try{
            let profile = await this.api.updateProfile(this.user.ud.auth, {
                id: this.profile.id,
                name: this.name,
                text: this.text,
                sn: this.sn
            });
            this.errorMsg = null;

            //プロフィール更新
            this.update.emit(profile);
        }catch(e){
            if (e instanceof AtError) {
                this.errorMsg = e.message;
            } else {
                throw e;
            }
        }
    }

    edit() {
        this.isEdit = !this.isEdit;
    }
}