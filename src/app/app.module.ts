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
    ResponsiveService
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
    OekakiComponent,
    ResWriteComponent,
    TopicFavoComponent
} from './components';

import {
    ResWriteDialogComponent, 
    ProfileDialogComponent,
    TopicAutoScrollMenuDialogComponent,
    ButtonDialogComponent
} from './dialogs';

import { AppComponent } from './app.component';

import {
    IndexPageComponent,
    TopicPageComponent,
    TopicSearchPageComponent,
    TopicWritePageComponent,
    FavoPageComponent,
    UserMsgPageComponent,
    UserNoticePageComponent,
    UserProfilePageComponent,
    TagsPageComponent,
    ResWritePageComponent
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
                component: IndexPageComponent
            },
            {
                path: 'topic/search',
                component: TopicSearchPageComponent
            },
            {
                path: 'topic/write',
                component: TopicWritePageComponent
            },
            {
                path: 'topic/:id/write',
                component: ResWritePageComponent
            },
            {
                path: 'topic/:id',
                component: TopicPageComponent
            },
            {
                path: 'user/profile',
                component: UserProfilePageComponent
            },
            {
                path: 'user/notice',
                component: UserNoticePageComponent
            },
            {
                path: 'user/msg',
                component: UserMsgPageComponent
            },
            {
                path: 'favo',
                component: FavoPageComponent
            },
            {
                path: 'tags',
                component: TagsPageComponent
            }
        ])
    ],
    declarations: [
        MdPipe,
        MapPipe,
        AtDatePipe,
        HtmlPipe,

        AppComponent,
        ResWritePageComponent,
        ResWriteComponent,
        TopicHistoryComponent,
        ProfileDialogComponent,
        UserProfileAddComponent,
        UserProfileEditComponent,
        ResWriteDialogComponent,
        ResComponent,
        TopicDataComponent,
        TopicEditComponent,
        TopicSearchPageComponent,
        TopicWritePageComponent,
        TopicPageComponent,
        IndexPageComponent,
        UserProfilePageComponent,
        UserNoticePageComponent,
        UserMsgPageComponent,
        UserMsgPageComponent,
        FavoPageComponent,
        TopicAutoScrollMenuDialogComponent,
        TopicListItemComponent,
        ButtonDialogComponent,
        MdEditorComponent,
        OekakiComponent,
        TagsPageComponent,
        TopicFavoComponent
    ],
    // エントリ
    bootstrap: [AppComponent],
    providers: [
        UserService,
        ResponsiveService
    ],
    entryComponents: [
        //モーダルで使うコンポーネント
        ProfileDialogComponent,
        ResWriteDialogComponent,
        TopicAutoScrollMenuDialogComponent,
        ButtonDialogComponent
    ]

})
export class AppModule { }
