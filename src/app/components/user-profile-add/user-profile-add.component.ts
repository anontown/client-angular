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
import { UserService} from '../../services';


@Component({
    selector: 'app-user-profile-add',
    templateUrl: './user-profile-add.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class UserProfileAddComponent implements OnInit, OnDestroy {
    private name = "";
    private text = "";
    sn = "";
    private errorMsg: string | null = null;

    @Output()
    add = new EventEmitter<Profile>();

    constructor(public user: UserService, private api: AtApiService) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    async ok() {
        try{
            let p = await this.api.createProfile(this.user.ud.auth, {
                name: this.name,
                text: this.text,
                sn: this.sn
            });

            this.sn = "";
            this.name = "";
            this.text = "";
            this.add.emit(p);
        }catch(e){
            if (e instanceof AtError) {
                this.errorMsg = e.message;
            } else {
                throw e;
            }
        }

    }
}