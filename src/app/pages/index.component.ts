import { Component, OnInit } from '@angular/core';
import { AtApiService, } from 'anontown';
import { UserDataService } from '../services';
import { Config } from '../config';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'at-index',
  template: `
    <div class="container">
      <h1>匿名掲示板Anontownへようこそ</h1>
      2chの不便な点を改善した掲示板です。<br>
      登録は10秒で終わります。メアドなどは一切不要です。<br>
      専ブラなどのクライアントソフトも不要な為すぐに使い始めることが出来ます。<br>
      まずは<a href="https://kgtkr.gitbooks.io/anontown/content/">ドキュメント</a>を読んで下さい。<br>
      <br>
      ※現在テスト運用中なので予告なくデータ削除等を行う場合があります
    </div>
  `
})
export class IndexComponent implements OnInit {
  userURL = Config.userURL;

  constructor(private api: AtApiService,
    private route: ActivatedRoute,
    private ud: UserDataService
  ) {

  }

  ngOnInit() {
    this.route.queryParams.forEach(async (params) => {
      if (params["id"] && params["key"]) {
        let token = await this.api.findTokenReq({
          id: params["id"] as string,
          key: params["key"] as string
        })

        this.ud.login(token);
      }
    });
  }
}