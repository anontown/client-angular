import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AnontownModule,AtApiService } from 'anontown';
import {
    MdPipe,
    MapPipe
} from './pipes';
import {
    UserDataService,
} from './services';
import 'hammerjs';

import { RouterModule } from '@angular/router';
import {
    TopicHistoryComponent,
    UserProfileEditComponent,
    UserProfileAddComponent,
    ResWriteComponent,
    ResComponent,
    TopicDataComponent,
    TopicEditComponent,
} from './components';

import { AppComponent } from './app.component';

import {
    IndexComponent,
    ProfileComponent,
    TopicComponent,
    TopicSearchComponent,
    TopicWriteComponent,
    UserFavoTopicComponent,
    UserMsgComponent,
    UserNoticeComponent,
    UserProfileComponent
} from './pages';
import { Config } from './config';

AtApiService.serverURL=Config.serverURL;
@NgModule({
    imports: [
        AnontownModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
        RouterModule.forRoot([
            {
                path: '',
                component: IndexComponent
            },
            {
                path: 'profile/:id',
                component: ProfileComponent
            },
            {
                path: 'topic/search',
                component: TopicSearchComponent
            },
            {
                path: 'topic/write',
                component: TopicWriteComponent
            },
            {
                path: 'topic/:id',
                component: TopicComponent
            },
            {
                path: 'user/profile',
                component: UserProfileComponent
            },
            {
                path: 'user/notice',
                component: UserNoticeComponent
            },
            {
                path: 'user/msg',
                component: UserMsgComponent
            },
            {
                path: 'favo',
                component: UserFavoTopicComponent
            },
        ])
    ],
    declarations: [
        MdPipe,
        MapPipe,

        AppComponent,
        TopicHistoryComponent,
        ProfileComponent,
        UserProfileAddComponent,
        UserProfileEditComponent,
        ResWriteComponent,
        ResComponent,
        TopicDataComponent,
        TopicEditComponent,
        TopicSearchComponent,
        TopicWriteComponent,
        TopicComponent,
        IndexComponent,
        UserProfileComponent,
        UserNoticeComponent,
        UserMsgComponent,
        UserMsgComponent,
        UserFavoTopicComponent
    ],
    //エントリ
    bootstrap: [AppComponent],
    providers: [
        UserDataService
    ]

})
export class AppModule { }
