import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AtApiService } from 'anontown';
import { UserService } from '../services';
import { Config } from '../config';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'at-index',
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class IndexComponent implements OnInit {
  userURL = Config.userURL;

  constructor(private api: AtApiService,
    private route: ActivatedRoute,
    private user: UserService
  ) {

  }

  async ngOnInit() {
    let id: string;
    let key: string;
    this.route.queryParams.forEach(async (params) => {
      id = params["id"];
      key = params["key"];
    });
    if (id && key) {
      let token = await this.api.findTokenReq({
        id,
        key
      });

      await this.user.login(token);

      localStorage.setItem("token", JSON.stringify({
        id: token.id,
        key: token.key
      }));

    }
  }
}