import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import * as Immutable from 'immutable';

@Component({
  selector: 'app-tag-favo',
  templateUrl: './tag-favo.component.html',
  styleUrls: ['./tag-favo.component.scss']
})
export class TagFavoComponent implements OnInit {

  constructor(public user: UserService,
    private router: Router) { }

  ngOnInit() {
  }

  click(tag: Immutable.Set<string>) {
    this.router.navigate(['/topic/search'], { queryParams: { tags: tag.join(' ') } });
  }
}