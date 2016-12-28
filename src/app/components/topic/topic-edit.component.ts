import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
    AtApiService,
    Topic,
    AtError
} from 'anontown';
import { UserDataService } from '../../services';


@Component({
    selector: 'at-topic-edit',
    templateUrl: './topic-edit.component.html'
})
export class TopicEditComponent extends OnInit {
    @Input()
    private topic: Topic;

    @Output()
    update = new EventEmitter<Topic>();

    private title = "";
    private category = "";
    private text = "";
    private errorMsg: string | null = null;

    constructor(private ud: UserDataService,
        private api: AtApiService) {
        super();
    }

    ngOnInit() {
        this.title = this.topic.title;
        this.category = this.topic.category.join("/");
        this.text = this.topic.text;
    }

    ok() {
        (async () => {
            let topic = await this.api.updateTopic(await this.ud.auth, {
                id: this.topic.id,
                title: this.title,
                category: this.category.length === 0 ? [] : this.category.split("/"),
                text: this.text
            });
            this.errorMsg = null;
            this.update.emit(topic);
        })().catch(e => {
            if (e instanceof AtError) {
                this.errorMsg = e.message;
            } else {
                throw e;
            }
        });
    }
} 