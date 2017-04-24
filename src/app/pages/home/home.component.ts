import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomePageComponent implements OnInit {
  constructor(public user: UserService,
    private titleService: Title) {

  }

  ngOnInit() {
    this.titleService.setTitle("Anontown");
  }
}