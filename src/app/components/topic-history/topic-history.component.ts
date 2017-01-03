import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy
} from '@angular/core';
import { AtApiService, Topic, Res, History } from 'anontown';
import {
    UserService,
    IUserDataListener,
    IUserData
} from '../../services';
import * as Immutable from 'immutable';

@Component({
    selector: 'app-topic-history',
    templateUrl: './topic-history.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class TopicHistoryComponent implements OnInit, OnDestroy {
    @Input()
    topic: Topic;

    @Input()
    history: History;

    private hashReses = Immutable.List<Res>();

    private isDetail = false;

    detail() {
        this.isDetail = !this.isDetail;
    }

    constructor(private api: AtApiService,
        private user: UserService) {

    }

    ud: IUserData;
    private udListener: IUserDataListener;

    ngOnInit() {
        this.udListener = this.user.addUserDataListener(ud => {
            this.ud = ud;
        });
    }

    ngOnDestroy() {
        this.user.removeUserDataListener(this.udListener);
    }

    updateRes(res: Res) {
        this.hashReses.set(this.hashReses.findIndex((r) => r.id === res.id), res);
    }

    async hashClick() {
        if (this.hashReses.size !== 0) {
            this.hashReses = Immutable.List<Res>();
        } else {
            this.hashReses = Immutable.List(await this.api.findResHash(this.ud.auth, {
                topic: this.topic.id,
                hash: this.history.hash
            }));

        }
    }
}