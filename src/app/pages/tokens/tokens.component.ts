import { Component, OnInit, OnDestroy } from '@angular/core';
import { AtApiService, Token, IAuthUser, Client } from 'anontown';
import { UserService, IAuthListener } from '../services/user.service';
import * as Immutable from 'immutable';


@Component({
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensPageComponent implements OnInit, OnDestroy {
  private auth: IAuthUser = null;
  private tokens: Immutable.List<Token> = null;
  private clients: Immutable.Map<string, Client> = null;

  constructor(private user: UserService, private api: AtApiService) {

  }
  private authListener: IAuthListener;
  ngOnInit() {
    this.authListener = this.user.addAuthListener(async auth => {
      if (auth !== null) {
        let tokens = Immutable.List(await this.api.findTokenAll(auth));
        let clients = Immutable.Map((await this.api.findClientIn(this.auth, {
          //重複要素削除→ClientIDリスト→配列
          ids: Immutable.Set(tokens).map(t => t.client).toArray()
        })).map(c => [c.id, c])) as Immutable.Map<string, Client>;

        this.clients = clients;
        this.tokens = tokens;
        this.auth = auth;
      } else {
        this.clients = null;
        this.tokens = null;
        this.auth = null;
      }
    });
  }

  ngOnDestroy() {
    this.user.removeAuthListener(this.authListener);
  }

  async key(token: Token) {
    this.update(await this.api.updateToken(this.auth, { id: token.id }));
  }

  async active(token: Token) {
    if (token.active) {
      this.update(await this.api.disableToken(this.auth, { id: token.id }));
    } else {
      this.update(await this.api.enableToken(this.auth, { id: token.id }));
    }
  }

  update(token: Token) {
    this.tokens = this.tokens.set(this.tokens.findIndex((t) => t.id === token.id), token);
  }
}
