import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { UserService, IUserDataListener } from '../../services';

import { Router } from '@angular/router';
import { Topic, AtApiService } from 'anontown';
import {MdSnackBar} from '@angular/material';
import * as Immutable from 'immutable';
@Component({
    selector: 'app-favo',
    templateUrl: './favo.component.html',
    styleUrls: ['./favo-component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class FavoComponent implements OnInit, OnDestroy {
    constructor(private user: UserService,
        private router: Router,
        private api: AtApiService,
        public snackBar: MdSnackBar) {
    }

    tfavo: Immutable.List<Topic>;
    private udListener: IUserDataListener;

    ngOnInit() {
        document.title="お気に入り";
        this.udListener = this.user.addUserDataListener(async () => {
            let ud=this.user.ud;
            if (ud !== null) {
                await this.update();
            } else {
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

    private async update() {
        try{
            this.tfavo = Immutable.List(await this.api.findTopicIn({ ids: this.user.ud.storage.topicFavo.toArray() }))
                .sort((a, b) => a.update > b.update ? -1 : a.update < b.update ? 1 : 0).toList();
        }catch(_e){
            this.snackBar.open("トピック取得に失敗");
        }
    }

    delTags(val:Immutable.Set<string>){
        let storage = this.user.ud.storage;
        storage.tagsFavo = storage.tagsFavo.delete(val);
        this.user.updateUserData();
    }
}