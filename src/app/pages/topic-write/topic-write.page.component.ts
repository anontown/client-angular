import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
    AtApiService,
    AtError,
    TopicType
} from 'anontown';
import { UserService} from '../../services';
import { Router } from '@angular/router';


@Component({
    templateUrl: './topic-write.page.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class TopicWritePageComponent implements OnInit, OnDestroy {
    private title = "";
    private tags = "";
    private text = "";
    private type: TopicType = "normal";
    private errorMsg: string | null = null;

    constructor(public user: UserService,
        private api: AtApiService,
        private router: Router) {
    }

    ngOnInit() {
        document.title="トピック作成"
    }

    ngOnDestroy() {
    }

    async write() {
        let ud=this.user.ud.getValue();
        try{
            let topic = await this.api.createTopic(ud.auth, {
                title: this.title,
                tags: this.tags.length === 0 ? [] : this.tags.split(/[\s　\,]+/),
                text: this.text,
                type: this.type
            });
            this.errorMsg = null;
            this.router.navigate(["topic", topic.id]);
        }catch(e){
            if (e instanceof AtError) {
                this.errorMsg = e.message;
            } else {
                throw e;
            }
        }
    }
}

