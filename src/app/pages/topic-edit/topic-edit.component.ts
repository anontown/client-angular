import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import {
    AtApiService,
    Topic,
    AtError,
    IAtError
} from 'anontown';
import { UserService } from '../../services';

import { MdSnackBar } from '@angular/material';

@Component({
    templateUrl: './topic-edit.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class TopicEditPageComponent implements OnInit, OnDestroy {
    private topic: Topic;

    private title = "";
    private tags = "";
    private text = "";
    private errors: IAtError[] = [];

    constructor(private user: UserService,
        private api: AtApiService,
        private route: ActivatedRoute,
        public snackBar: MdSnackBar,
        private router: Router) {
    }

    ngOnInit() {
        document.title = "トピック編集";

        this.route.params.forEach(async params => {
            try {
                let topic = await this.api.findTopicOne({
                    id: params['id']
                });

                this.title = topic.title;
                this.tags = topic.tags.join(" ");
                this.text = topic.text;

                this.topic = topic;
            } catch (_e) {
                this.snackBar.open('トピック取得に失敗');
            }
        });
    }

    ngOnDestroy() {
    }

    async ok() {
        let ud = this.user.ud.getValue();
        try {
            await this.api.updateTopic(ud.auth, {
                id: this.topic.id,
                title: this.title,
                tags: this.tags.length === 0 ? [] : this.tags.split(/[\s　\,]+/),
                text: this.text
            });
            this.router.navigate(['/topic', this.topic.id]);
            this.errors = [];
        } catch (e) {
            if (e instanceof AtError) {
                this.errors = e.errors;
            } else {
                throw e;
            }
        }
    }
} 