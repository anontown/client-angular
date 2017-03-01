import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Config } from '../../config';
import { UserService } from '../../services/user.service';

@Component({
  templateUrl: './index.page.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class IndexPageComponent implements OnInit {
  userURL = Config.userURL;

  constructor(public user: UserService) {

  }

  ngOnInit() {
    document.title = "Anontown";
  }
}