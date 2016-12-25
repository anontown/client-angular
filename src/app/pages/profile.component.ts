import { Component, OnInit, Input } from '@angular/core';
import { AtApiService, Profile } from 'anontown';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from '../services'

@Component({
  selector: 'at-profile',
  template: `
    <div *ngIf="profile" class="panel panel-default">
      <div class="panel-body">
        <dl class="dl-horizontal">
          <dt>ID</dt>
          <dd>{{profile.id}}</dd>
          <dt>名前</dt>
          <dd>{{profile.name}}</dd>
          <dd>
            <div class="panel panel-default">
              <div [innerHTML]="profile.mdtext|md" class="panel-body"></div>
            </div>
          </dd>
        </dl>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  @Input()
  private profile: Profile;

  constructor(private api: AtApiService,
    private route: ActivatedRoute,
    private ud: UserDataService) {
  }

  ngOnInit() {
    if (!this.profile) {
      this.route.params.forEach(async (params) => {
        let id = params['id'] as string;
        this.profile = await this.api.findProfileOne(await this.ud.authOrNull, { id });
      });
    }
  }
}