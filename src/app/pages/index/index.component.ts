import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Config } from '../../config';

@Component({
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class IndexComponent implements OnInit {
  userURL = Config.userURL;

  constructor() {

  }

  ngOnInit() {
    document.title="Anontown";
  }
}