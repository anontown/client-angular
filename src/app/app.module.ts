import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { ColorPickerModule } from 'ngx-color-picker';
import {
  MapPipe,
  AtDatePipe,
  ReversePipe
} from './pipes';
import {
  UserService,
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
  ClientEditComponent,
  PageComponent,
  MdComponent
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
import 'hammerjs';
import {
  HomePageComponent,
  TopicPageComponent,
  TopicSearchPageComponent,
  MessagesPageComponent,
  NotificationsPageComponent,
  ProfilesPageComponent,
  NotFoundComponent,
  ResPageComponent,
  InPageComponent,
  AuthPageComponent,
  DevSettingPageComponent,
  AppsSettingPageComponent,
  AccountSettingPageComponent,
  SettingsPageComponent,
  TopicCreatePageComponent
} from './pages';

import { InfiniteScrollDirective, InfiniteScrollItemDirective } from './directives';


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
        component: HomePageComponent
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
        path: 'topic/create',
        component: TopicCreatePageComponent
      },
      {
        path: 'topic/:id',
        component: TopicPageComponent
      },
      {
        path: 'profiles',
        component: ProfilesPageComponent
      },
      {
        path: 'notifications',
        component: NotificationsPageComponent
      },
      {
        path: 'messages',
        component: MessagesPageComponent
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
            component: DevSettingPageComponent,
          },
          {
            path: 'apps',
            component: AppsSettingPageComponent,
          },
          {
            path: 'account',
            component: AccountSettingPageComponent,
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
    MapPipe,
    AtDatePipe,
    ReversePipe,

    InfiniteScrollDirective,
    InfiniteScrollItemDirective,

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
    TopicPageComponent,
    TopicCreatePageComponent,
    HomePageComponent,
    ProfilesPageComponent,
    NotificationsPageComponent,
    MessagesPageComponent,
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
    DevSettingPageComponent,
    AppsSettingPageComponent,
    AccountSettingPageComponent,
    SettingsPageComponent,
    PageComponent,
    MdComponent
  ],
  // エントリ
  bootstrap: [AppComponent],
  providers: [
    UserService,
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
export class AppModule {
}
