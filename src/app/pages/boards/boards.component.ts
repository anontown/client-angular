import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services';
@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {

  constructor(public bs: BoardService) { }

  ngOnInit() {
    document.title="板一覧";
  }

}
