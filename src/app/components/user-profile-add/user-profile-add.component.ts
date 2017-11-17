import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  UserService,
  AtApiService,
  AtError,
  IProfileAPI,
  IAtError
} from '../../services';


@Component({
  selector: 'app-user-profile-add',
  templateUrl: './user-profile-add.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class UserProfileAddComponent implements OnInit, OnDestroy {
  name = '';
  text = '';
  sn = '';
  errors: IAtError[] = [];

  @Output()
  add = new EventEmitter<IProfileAPI>();

  constructor(public user: UserService, private api: AtApiService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  async ok() {
    let ud = this.user.ud.getValue()!;
    try {
      let p = await this.api.createProfile(ud.auth, {
        name: this.name,
        text: this.text,
        sn: this.sn
      });

      this.sn = '';
      this.name = '';
      this.text = '';
      this.add.emit(p);
    } catch (e) {
      if (e instanceof AtError) {
        this.errors = e.errors;
      } else {
        throw e;
      }
    }

  }
}