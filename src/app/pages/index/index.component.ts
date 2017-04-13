import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class IndexPageComponent implements OnInit {
  constructor(public user: UserService,
    private titleService: Title) {

  }

  ngOnInit() {
    this.titleService.setTitle("Anontown");
  }
}