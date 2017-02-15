import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { UserService,  } from '../../services';

import { Router } from '@angular/router';
import { Topic, AtApiService } from 'anontown';
import {MdSnackBar} from '@angular/material';
import * as Immutable from 'immutable';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './favo.page.component.html',
    styleUrls: ['./favo.page.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class FavoPageComponent implements OnInit, OnDestroy {
    constructor(private user: UserService,
        private router: Router,
        private api: AtApiService,
        public snackBar: MdSnackBar) {
    }

    tfavo: Immutable.List<Topic>;
    private subscription: Subscription;

    ngOnInit() {
        document.title="お気に入り";
        this.subscription = this.user.ud.subscribe(async (ud) => {
            if (ud !== null) {
                await this.update();
            } else {
                this.tfavo = null;
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    linkClick(id: number) {
        this.router.navigate(['/topic', id])
    }

    private async update() {
        let ud=this.user.ud.getValue();
        try{
            this.tfavo = Immutable.List(await this.api.findTopicIn({ ids: ud.storage.topicFavo.toArray() }))
                .sort((a, b) => a.update > b.update ? -1 : a.update < b.update ? 1 : 0).toList();
        }catch(_e){
            this.snackBar.open("トピック取得に失敗");
        }
    }

    async delTags(val:Immutable.Set<string>){
        let ud=this.user.ud.getValue();
        let storage = ud.storage;
        storage.tagsFavo = storage.tagsFavo.delete(val);
        this.user.ud.next(ud);
    }
}