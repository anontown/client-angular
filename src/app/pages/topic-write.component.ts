import { Component, } from '@angular/core';
import {
    AtApiService,
    AtError
} from 'anontown';
import { UserDataService } from '../services';
import { Router } from '@angular/router';


@Component({
    selector: 'at-topic-write',
    template: `
        <div *ngIf="ud.isToken|async" class="container">
            <form (ngSubmit)="write()">
                <div class="alert alert-danger" *ngIf="errorMsg!==null">
                    <span class="glyphicon glyphicon-exclamation-sign"></span>
                    {{errorMsg}}
                </div>
                <div class="form-group">
                    <label>タイトル</label>
                    <input type="text" class="form-control" [(ngModel)]="title" name="title">
                </div>
                <div class="form-group">
                    <label>カテゴリ</label>
                    <input type="text" class="form-control" [(ngModel)]="category" name="category">
                </div>
                <div class="form-group">
                    <label>本文</label>
                    <textarea class="form-control" [(ngModel)]="text" name="text"></textarea>
                    <div [innerHTML]="text|md" class="well"></div>
                </div>
                <button type="submit" class="btn btn-default">書き込む</button>
            </form>
        </div>
        <div *ngIf="ud.notToken|async" class="container">
            ログインしないと書き込めません
        </div>
    `,
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

