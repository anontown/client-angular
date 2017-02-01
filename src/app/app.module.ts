import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { AnontownModule, AtApiService } from 'anontown';
import {
    MdPipe,
    MapPipe,
    AtDatePipe,
    HtmlPipe
} from './pipes';
import {
    UserService,
} from './services';
import 'hammerjs';

import { RouterModule } from '@angular/router';
import {
    TopicHistoryComponent,
    UserProfileEditComponent,
    UserProfileAddComponent,
    ResComponent,
    TopicEditComponent,
    TopicListItemComponent,
    MdEditorComponent,
    TopicDataComponent,
    OekakiComponent
} from './components';

import {
    ResWriteComponent,
    ProfileComponent,
    TopicAutoScrollMenuComponent,
    ButtonDialogComponent
} from './dialogs';

import { AppComponent } from './app.component';

import {
    IndexComponent,
    TopicComponent,
    TopicSearchComponent,
    TopicWriteComponent,
    FavoComponent,
    UserMsgComponent,
    UserNoticeComponent,
    UserProfileComponent,
    TagsComponent
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
                component: FavoComponent
            },
            {
                path: 'tags',
                component: TagsComponent
            }
        ])
    ],
    declarations: [
        MdPipe,
        MapPipe,
        AtDatePipe,
        HtmlPipe,

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
        FavoComponent,
        TopicAutoScrollMenuComponent,
        TopicListItemComponent,
        ButtonDialogComponent,
        MdEditorComponent,
        OekakiComponent,
        TagsComponent
    ],
    // エントリ
    bootstrap: [AppComponent],
    providers: [
        UserService,
    ],
    entryComponents: [
        //モーダルで使うコンポーネント
        ProfileComponent,
        ResWriteComponent,
        TopicAutoScrollMenuComponent,
        ButtonDialogComponent
    ]

})
export class AppModule { }
