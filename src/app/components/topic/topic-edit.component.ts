import {
    Component,
    OnInit,
    Input,
    EventEmitter,
    Output,
    OnDestroy,
    ChangeDetectionStrategy,
} from '@angular/core';
import {
    AtApiService,
    Topic,
    AtError
} from 'anontown';
import { UserService, IUserDataListener, IUserData } from '../../services';


@Component({
    selector: 'at-topic-edit',
    templateUrl: './topic-edit.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class TopicEditComponent implements OnInit, OnDestroy {
    @Input()
    private topic: Topic;

    @Output()
    update = new EventEmitter<Topic>();

    private title = "";
    private category = "";
    private text = "";
    private errorMsg: string | null = null;

    ud: IUserData = null;
    private udListener: IUserDataListener;

    constructor(private user: UserService,
        private api: AtApiService) {
    }

    ngOnInit() {
        this.title = this.topic.title;
        this.category = this.topic.category.join("/");
        this.text = this.topic.text;
        this.udListener = this.user.addUserDataListener(ud => {
            this.ud = ud;
        });
    }

    ngOnDestroy() {
        this.user.removeUserDataListener(this.udListener);
    }

    ok() {
        (async () => {
            let topic = await this.api.updateTopic(this.ud.auth, {
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