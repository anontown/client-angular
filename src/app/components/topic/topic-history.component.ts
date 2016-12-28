import { Component, Input } from '@angular/core';
import { AtApiService, Topic, Res, History } from 'anontown';
import { UserDataService } from '../../services';

@Component({
    selector: 'at-topic-history',
    templateUrl: './topic-history.component.html'
})
export class TopicHistoryComponent {
    @Input()
    private topic: Topic;

    @Input()
    private history: History;

    private hashReses: Res[] = [];

    private isDetail = false;

    detail() {
        this.isDetail = !this.isDetail;
    }

    constructor(private api: AtApiService,
        private ud: UserDataService) {

    }

    updateRes(res: Res) {
        this.hashReses[this.hashReses.findIndex((r) => r.id === res.id)] = res;
    }

    async hashClick() {
        if (this.hashReses.length !== 0) {
            this.hashReses = [];
        } else {
            this.hashReses = (await this.api.findResHash(await this.ud.authOrNull, {
                topic: this.topic.id,
                hash: this.history.hash
            }));

        }
    }
}