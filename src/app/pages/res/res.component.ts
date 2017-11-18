import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  UserService,
  IResAPI,
  AtApiService,
  IAuthToken,
  IProfileAPI
} from '../../services';

@Component({
  templateUrl: './res.component.html',
  styleUrls: ['./res.component.scss'],
  selector: 'app-page-res'
})
export class ResPageComponent implements OnInit {
  res: IResAPI<IProfileAPI>;

  constructor(private api: AtApiService,
    private route: ActivatedRoute,
    public user: UserService) { }

  ngOnInit() {
    this.route.params.forEach(params => {
      this.user.ud
        .first()
        .subscribe(async ud => {
          let token: IAuthToken | null;
          if (ud) {
            token = ud.auth;
          } else {
            token = null;
          }

          this.res = await this.api.resSetProfile(await this.api.findResOne(token, {
            id: params['id']
          }), token);
        });

    });
  }

}