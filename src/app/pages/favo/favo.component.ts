import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { UserService, IUserData, IUserDataListener, BoardService } from '../../services';

import { Router } from '@angular/router';
import { Topic, AtApiService } from 'anontown';

import * as Immutable from 'immutable';

@Component({
    selector: 'app-favo',
    templateUrl: './favo.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class FavoComponent implements OnInit, OnDestroy {
    constructor(private user: UserService,
        private router: Router,
        private api: AtApiService,
        public board: BoardService) {
    }

    tfavo: Immutable.List<Topic>;
    ud: IUserData;
    private udListener: IUserDataListener;

    ngOnInit() {
        this.udListener = this.user.addUserDataListener(async ud => {
            if (ud !== null) {
                this.ud = ud;
                await this.update();
            } else {
                this.ud = null;
                this.tfavo = null;
            }
        });
    }

    ngOnDestroy() {
        this.user.removeUserDataListener(this.udListener);
    }

    linkClick(id: number) {
        this.router.navigate(['/topic', id])
    }

    getName(c: string) {
        let topic = this.board.topics.find(x => x.category.join("/") === c);
        if (topic) {
            return topic.title;
        } else {
            return c.length === 0 ? "/" : c;
        }
    }

    private async update() {
        this.tfavo = Immutable.List(await this.api.findTopicIn({ ids: this.ud.storage.topicFavo.toArray() }))
            .sort((a, b) => a.update > b.update ? -1 : a.update < b.update ? 1 : 0).toList();
    }
}