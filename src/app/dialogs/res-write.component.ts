import {
    Component,
    Input,
    Output,
    EventEmitter,
    NgZone,
    OnInit,
    OnDestroy
} from '@angular/core';
import {
    AtApiService,
    Res,
    Topic,
    AtError
} from 'anontown';

import { UserService, IUserData, IUserDataListener } from '../services';

@Component({
    selector: 'at-res-write',
    templateUrl: './res-write.component.html'
})
export class ResWriteComponent implements OnInit, OnDestroy {
    private name = "";
    private text = "";
    private profile: string | null = null;
    private errorMsg: string | null = null;
    @Output()
    write = new EventEmitter<Res>();

    ud: IUserData = null;
    private udListener: IUserDataListener;

    ngOnInit() {
        this.udListener = this.user.addUserDataListener(ud => {
            this.ud = ud;
        });
    }

    ngOnDestroy() {
        this.user.removeUserDataListener(this.udListener);
    }

    constructor(private user: UserService,
        private api: AtApiService,
        private zone: NgZone) {
    }



    key(e: any) {
        this.zone.runOutsideAngular(() => {
            if (e.shiftKey && e.keyCode == 13) {
                this.zone.run(() => {
                    this.ok();
                });
            }
        });
    }

    @Input()
    topic: Topic | string;

    @Input()
    reply: Res | null = null;

    ok() {
        (async () => {
            let res = await this.api.createRes(this.ud.auth, {
                topic: typeof this.topic === "string" ? this.topic : this.topic.id,
                name: this.name,
                text: this.text,
                reply: this.reply !== null ? this.reply.id : null,
                profile: this.profile
            });

            this.text = "";
            this.reply = null;
            this.errorMsg = null;
            this.write.emit(res);
        })().catch(e => {
            if (e instanceof AtError) {
                this.errorMsg = e.message;
            } else {
                throw e;
            }
        });
    }

    aa() {
        if (this.text.length === 0) {
            return;
        }
        this.text = this.text.split(/\r\n|\r|\n/).map(s => "    " + s).join("\n");
    }
}