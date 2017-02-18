import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy
} from '@angular/core';
import { UserService } from '../../services';

@Component({
    templateUrl: './favo.page.component.html',
    styleUrls: ['./favo.page.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class FavoPageComponent implements OnInit, OnDestroy {
    constructor(public user: UserService) {
    }

    ngOnInit() {
        document.title = "お気に入り";
    }

    ngOnDestroy() {
    }
}