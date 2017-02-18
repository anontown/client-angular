import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy
} from '@angular/core';
import { UserService, } from '../../services';

import { MdSnackBar } from '@angular/material';
import * as Immutable from 'immutable';

@Component({
    templateUrl: './favo.page.component.html',
    styleUrls: ['./favo.page.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class FavoPageComponent implements OnInit, OnDestroy {
    constructor(private user: UserService,
        public snackBar: MdSnackBar) {
    }

    ngOnInit() {
        document.title = "お気に入り";
    }

    ngOnDestroy() {
    }

    async delTags(val: Immutable.Set<string>) {
        let ud = this.user.ud.getValue();
        let storage = ud.storage;
        storage.tagsFavo = storage.tagsFavo.delete(val);
        this.user.ud.next(ud);
    }
}