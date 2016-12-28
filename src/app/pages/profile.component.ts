import { Component, OnInit, Input } from '@angular/core';
import { AtApiService, Profile } from 'anontown';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from '../services'

@Component({
  selector: 'at-profile',
  templateUrl: './profile.component.html'
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