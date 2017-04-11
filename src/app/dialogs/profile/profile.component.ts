import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { UserService,Profile } from '../../services'

@Component({
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProfileDialogComponent implements OnInit, OnDestroy {
  @Input()
  profile: Profile;

  constructor(public user: UserService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}