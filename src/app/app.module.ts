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
    HtmlPipe,
    ReversePipe
} from './pipes';
import {
    UserService,
    ResponsiveService
} from './services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';

import { RouterModule } from '@angular/router';
import {
    TopicHistoryComponent,
    UserProfileEditComponent,
    UserProfileAddComponent,
    ResComponent,
    TopicListItemComponent,
    MdEditorComponent,
    OekakiComponent,
    ResWriteComponent,
    TopicFavoComponent,
    TagFavoComponent,
    TagsInputComponent
} from './components';

import {
    ResWriteDialogComponent,
    ProfileDialogComponent,
    TopicAutoScrollMenuDialogComponent,
    ButtonDialogComponent,
    TopicDataDialogComponent,
    TopicEditDialogComponent,
    TopicForkDialogComponent
} from './dialogs';

import { AppComponent } from './app.component';

import {
    IndexPageComponent,
    TopicPageComponent,
    TopicSearchPageComponent,
    TopicWritePageComponent,
    UserMsgPageComponent,
    UserNoticePageComponent,
    UserProfilePageComponent,
    NotFoundComponent,
    ResPageComponent
} from './pages';
import { Config } from './config';

import { InfiniteScrollDirective } from './directives';


AtApiService.serverURL = Config.serverURL;
@NgModule({
    imports: [
        AnontownModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        MaterialModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            {
                path: '',
                component: IndexPageComponent
            },
            {
                path: 'res/:id',
                component: ResPageComponent
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
                path: '404',
                component: NotFoundComponent
            },
            {
                path: '**',
                redirectTo: '/404'
            }
        ])
    ],
    declarations: [
        MdPipe,
        MapPipe,
        AtDatePipe,
        HtmlPipe,
        ReversePipe,

        InfiniteScrollDirective,

        AppComponent,
        ResWriteComponent,
        TopicHistoryComponent,
        ProfileDialogComponent,
        UserProfileAddComponent,
        UserProfileEditComponent,
        ResWriteDialogComponent,
        ResComponent,
        TopicDataDialogComponent,
        TopicEditDialogComponent,
        TopicForkDialogComponent,
        TopicSearchPageComponent,
        TopicWritePageComponent,
        TopicPageComponent,
        IndexPageComponent,
        UserProfilePageComponent,
        UserNoticePageComponent,
        UserMsgPageComponent,
        UserMsgPageComponent,
        TopicAutoScrollMenuDialogComponent,
        TopicListItemComponent,
        ButtonDialogComponent,
        MdEditorComponent,
        OekakiComponent,
        TopicFavoComponent,
        NotFoundComponent,
        TagFavoComponent,
        TagsInputComponent,
        ResPageComponent
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
        ButtonDialogComponent,
        TopicDataDialogComponent,
        TopicEditDialogComponent,
        TopicForkDialogComponent
    ]

})
export class AppModule { }
