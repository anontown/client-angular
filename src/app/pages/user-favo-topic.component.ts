import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services';

import { Router } from '@angular/router';
import { Topic } from 'anontown';


@Component({
    selector: 'at-user-favo-topic',
    template: `
        <div *ngIf="ud.isToken|async" class="container">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>タイトル</th>
                    <tr>
                </thead>
                <tbody>
                    <tr *ngFor="let t of favo" (click)="linkClick(t.id)">
                        <td>{{t.title}}</td>
                    <tr>
                </tbody>
            </table>
        </div>
        <div *ngIf="ud.notToken|async" class="container">
            ログインしないと表示出来ません。
        </div>
    `,
})
export class UserFavoTopicComponent implements OnInit {
    private ud: UserDataService;

    private favo: Topic[];

    constructor(ud: UserDataService,
        private router: Router) {
        this.ud = ud;
    }

    async ngOnInit() {
        this.favo = (await this.ud.storage).topicFav;
    }

    linkClick(id: number) {
        this.router.navigate(['/topic', id])
    }
}