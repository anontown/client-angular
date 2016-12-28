import { Component, } from '@angular/core';
import {
    AtApiService,
    AtError
} from 'anontown';
import { UserDataService } from '../services';
import { Router } from '@angular/router';


@Component({
    selector: 'at-topic-write',
    templateUrl: './topic-write.component.html'
})
export class TopicWriteComponent {
    private title = "";
    private category = "";
    private text = "";
    private errorMsg: string | null = null;

    constructor(private ud: UserDataService,
        private api: AtApiService,
        private router: Router) {
    }

    write() {
        (async () => {
            let topic = await this.api.createTopic(await this.ud.auth, {
                title: this.title,
                category: this.category.length === 0 ? [] : this.category.split("/"),
                text: this.text
            });
            this.errorMsg = null;
            this.router.navigate(["topic", topic.id]);
        })().catch(e => {
            if (e instanceof AtError) {
                this.errorMsg = e.message;
            } else {
                throw e;
            }
        });
    }
}

