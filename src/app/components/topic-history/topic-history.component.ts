import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy
} from '@angular/core';
import {
    UserService, 
    AtApiService, 
    ITopicAPI,
     IResAPI,
      IHistoryAPI
} from '../../services';
import * as Immutable from 'immutable';
import { MdSnackBar } from '@angular/material';

@Component({
    selector: 'app-topic-history',
    templateUrl: './topic-history.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class TopicHistoryComponent implements OnInit, OnDestroy {
    @Input()
    topic: ITopicAPI;

    @Input()
    history: IHistoryAPI;

    private hashReses = Immutable.List<IResAPI>();

    private isDetail = false;

    detail() {
        this.isDetail = !this.isDetail;
    }

    constructor(private api: AtApiService,
        public user: UserService,
        public snackBar: MdSnackBar) {

    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    updateRes(res: IResAPI) {
        this.hashReses.set(this.hashReses.findIndex((r) => r.id === res.id), res);
    }

    async hashClick() {
        let ud = this.user.ud.getValue();
        try {
            if (this.hashReses.size !== 0) {
                this.hashReses = Immutable.List<IResAPI>();
            } else {
                this.hashReses = Immutable.List(await this.api.findResHash(ud.auth, {
                    topic: this.topic.id,
                    hash: this.history.hash
                }));

            }
        } catch (_e) {
            this.snackBar.open("レス取得に失敗");
        }
    }
}