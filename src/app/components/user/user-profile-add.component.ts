import {
    Component,
    OnInit,
    OnDestroy,
    EventEmitter,
    Output,
    ChangeDetectionStrategy
} from '@angular/core';
import {
    AtApiService,
    AtError,
    Profile
} from 'anontown';
import { UserService, IUserDataListener, IUserData } from '../../services';


@Component({
    selector: 'at-user-profile-add',
    templateUrl: './user-profile-add.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class UserProfileAddComponent implements OnInit, OnDestroy {
    private name = "";
    private text = "";
    private errorMsg: string | null = null;

    ud: IUserData;
    udListener: IUserDataListener;

    @Output()
    add = new EventEmitter<Profile>();

    constructor(private user: UserService, private api: AtApiService) {
    }

    ngOnInit() {
        this.udListener = this.user.addUserDataListener((ud) => {
            this.ud = ud;
        });
    }

    ngOnDestroy() {
        this.user.removeUserDataListener(this.udListener);
    }

    ok() {
        (async () => {
            let p = await this.api.createProfile(this.ud.auth, {
                name: this.name,
                text: this.text
            });

            this.name = "";
            this.text = "";
            this.add.emit(p);
        })().catch(e => {
            if (e instanceof AtError) {
                this.errorMsg = e.message;
            } else {
                throw e;
            }
        });

    }
}