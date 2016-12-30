import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { AnontownModule, AtApiService } from 'anontown';
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
    ResComponent,
    TopicEditComponent,

} from './components';

import {
    TopicDataComponent,
    ResWriteComponent,
    ProfileComponent,
    TopicAutoScrollMenuComponent
} from './dialogs';

import { AppComponent } from './app.component';

import {
    IndexComponent,
    TopicComponent,
    TopicSearchComponent,
    TopicWriteComponent,
    UserFavoTopicComponent,
    UserMsgComponent,
    UserNoticeComponent,
    UserProfileComponent
} from './pages';
import { Config } from './config';

AtApiService.serverURL = Config.serverURL;
@NgModule({
    imports: [
        AnontownModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        MaterialModule.forRoot(),
        ReactiveFormsModule,
        RouterModule.forRoot([
            {
                path: '',
                component: IndexComponent
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
        UserFavoTopicComponent,
        TopicAutoScrollMenuComponent
    ],
    //エントリ
    bootstrap: [AppComponent],
    providers: [
        UserDataService
    ],
    entryComponents: [
        //モーダルで使うコンポーネント
        ProfileComponent,
        ResWriteComponent,
        TopicDataComponent,
        TopicAutoScrollMenuComponent
    ]

})
export class AppModule { }
