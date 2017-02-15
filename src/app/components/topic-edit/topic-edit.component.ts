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
import { UserService} from '../../services';


@Component({
    selector: 'app-topic-edit',
    templateUrl: './topic-edit.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class TopicEditComponent implements OnInit, OnDestroy {
    @Input()
    private topic: Topic;

    @Output()
    update = new EventEmitter<Topic>();

    private title = "";
    private tags = "";
    private text = "";
    private errorMsg: string | null = null;

    constructor(private user: UserService,
        private api: AtApiService) {
    }

    ngOnInit() {
        this.title = this.topic.title;
        this.tags = this.topic.tags.join(" ");
        this.text = this.topic.text;
    }

    ngOnDestroy() {
    }

    async ok() {
        let ud=this.user.ud.getValue();
        try{
            let topic = await this.api.updateTopic(ud.auth, {
                id: this.topic.id,
                title: this.title,
                tags: this.tags.length === 0 ? [] : this.tags.split(/[\s　\,]+/),
                text: this.text
            });
            this.errorMsg = null;
            this.update.emit(topic);
        }catch(e){
            if (e instanceof AtError) {
                this.errorMsg = e.message;
            } else {
                throw e;
            }
        }
    }
} 