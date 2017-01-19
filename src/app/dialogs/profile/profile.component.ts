import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Profile } from 'anontown';
import { UserService } from '../../services'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProfileComponent implements OnInit, OnDestroy {
  @Input()
  profile: Profile;

  constructor(public user: UserService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}