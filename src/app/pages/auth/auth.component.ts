import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  UserService,
  AtApiService,
  IClientAPI
} from '../../services';
import { Title } from '@angular/platform-browser';
@Component({
  templateUrl: './auth.component.html',
  selector: 'app-page-auth'
})
export class AuthPageComponent implements OnInit, OnDestroy {
  client: IClientAPI;

  constructor(private api: AtApiService,
    private route: ActivatedRoute,
    public user: UserService,
    private titleService: Title) {

  }

  async ok() {
    let ud = this.user.ud.getValue() !;
    let token = await this.api.createTokenGeneral(ud.auth, { client: this.client.id });
    let req = await this.api.createTokenReq({ id: token.id, key: token.key });
    //リダイレクト
    location.href = this.client.url + '?' + 'id=' + req.token + '&key=' + encodeURI(req.key);
  }

  ngOnDestroy() {
  }

  async ngOnInit() {
    this.titleService.setTitle('アプリ認証');
    let ud = await this.user.ud.take(1).toPromise();
    if (ud) {
      let clientID = '';
      this.route.queryParams.forEach((params) => {
        clientID = params['client'];
      });

      this.client = await this.api.findClientOne(ud.auth, { id: clientID });
    }
  }
}