import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Config } from '../../config';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class IndexComponent implements OnInit {
  userURL = Config.userURL;

  constructor() {

  }

  ngOnInit() {
  }
}