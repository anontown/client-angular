import {
    Component,
    Input,
    Output,
    EventEmitter,
    NgZone,
    OnInit
} from '@angular/core';
import {
    AtApiService,
    Res,
    Topic,
    AtError
} from 'anontown';

import { UserDataService } from '../services';

@Component({
    selector: 'at-res-write',
    templateUrl:'./res-write.component.html'
})
export class ResWriteComponent implements OnInit {
    private name = "";
    private text = "";
    private profile: string | null = null;;
    private errorMsg: string | null = null;
    @Output()
    write = new EventEmitter<Res>();

    ngOnInit() {

    }

    constructor(private ud: UserDataService,
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
    private topic: Topic | string;

    @Input()
    private reply: Res | null = null;

    ok() {
        (async () => {
            let res = await this.api.createRes(await this.ud.auth, {
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