import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { ColorPickerModule } from 'ngx-color-picker';
import {
  MdPipe,
  MapPipe,
  AtDatePipe,
  HtmlPipe,
  ReversePipe
} from './pipes';
import {
  UserService,
  ResponsiveService,
  AtApiService,
  ImgurApiService
} from './services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';
import {
  TopicHistoryComponent,
  UserProfileEditComponent,
  UserProfileAddComponent,
  ResComponent,
  TopicListItemComponent,
  MdEditorComponent,
  ResWriteComponent,
  TopicFavoComponent,
  TagFavoComponent,
  TagsInputComponent,
  ClientComponent,
  ClientAddComponent,
  ClientEditComponent
} from './components';

import {
  ImageUploadDialogComponent,
  ProfileDialogComponent,
  ButtonDialogComponent,
  TopicDataDialogComponent,
  TopicEditDialogComponent,
  TopicForkDialogComponent,
  OekakiDialogComponent
} from './dialogs';
import { ReCaptchaModule } from 'angular2-recaptcha';
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
  ResPageComponent,
  InPageComponent,
  AuthPageComponent,
  ClientsPageComponent,
  AppsPageComponent,
  UserSettingPageComponent,
  SettingsPageComponent
} from './pages';

import { InfiniteScrollDirective } from './directives';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    ReactiveFormsModule,
    ReCaptchaModule,
    ColorPickerModule,
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
        path: 'in',
        component: InPageComponent
      },
      {
        path: 'auth',
        component: AuthPageComponent
      },
      {
        path: 'settings',
        component: SettingsPageComponent,
        children: [
          {
            path: 'dev',
            component: ClientsPageComponent,
          },
          {
            path: 'apps',
            component: AppsPageComponent,
          },
          {
            path: 'account',
            component: UserSettingPageComponent,
          },
        ]
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
    ImageUploadDialogComponent,
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
    TopicListItemComponent,
    ButtonDialogComponent,
    MdEditorComponent,
    OekakiDialogComponent,
    TopicFavoComponent,
    NotFoundComponent,
    TagFavoComponent,
    TagsInputComponent,
    ResPageComponent,
    ClientComponent,
    ClientAddComponent,
    ClientEditComponent,
    InPageComponent,
    AuthPageComponent,
    ClientsPageComponent,
    AppsPageComponent,
    UserSettingPageComponent,
    SettingsPageComponent
  ],
  // エントリ
  bootstrap: [AppComponent],
  providers: [
    UserService,
    ResponsiveService,
    AtApiService,
    ImgurApiService
  ],
  entryComponents: [
    //モーダルで使うコンポーネント
    ProfileDialogComponent,
    ImageUploadDialogComponent,
    ButtonDialogComponent,
    TopicDataDialogComponent,
    TopicEditDialogComponent,
    TopicForkDialogComponent,
    OekakiDialogComponent
  ]

})
export class AppModule { }
