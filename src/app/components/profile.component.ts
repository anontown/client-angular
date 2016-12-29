import { Component, OnInit, Input } from '@angular/core';
import { Profile } from 'anontown';
import { UserDataService } from '../services'

@Component({
  selector: 'at-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  @Input()
  profile: Profile;

  constructor(public ud: UserDataService) {
  }

  ngOnInit() {
  }
}