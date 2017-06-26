import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { UserService, IProfileAPI } from '../../services';

@Component({
  selector: 'app-dialog-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProfileDialogComponent implements OnInit, OnDestroy {
  @Input()
  profile: IProfileAPI;

  constructor(public user: UserService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}