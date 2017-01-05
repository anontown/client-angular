import { Component, OnInit, Input } from '@angular/core';
import { Board } from '../../services';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input()
  board: Board;

  isDetail = false;
  detail() {
    this.isDetail = !this.isDetail;
  }

  get cate(): string {
    return this.board.category.length !== 0 ? this.board.category.join('/') : '/';
  }

  constructor() { }

  ngOnInit() {
  }

}
