import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Config } from '../../config';

@Component({
  templateUrl: './index.page.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class IndexPageComponent implements OnInit {
  userURL = Config.userURL;

  constructor() {

  }

  ngOnInit() {
    document.title="Anontown";
  }
}