import { Component, OnInit } from '@angular/core';
import { AtApiService, } from 'anontown';
import { UserDataService } from '../services';
import { Config } from '../config';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'at-index',
  templateUrl: './index.component.html'
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