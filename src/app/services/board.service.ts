import { Injectable } from '@angular/core';
import { AtApiService, Topic } from 'anontown';
import * as Immutable from 'immutable';
import {MdSnackBar} from '@angular/material';
@Injectable()
export class BoardService {
    board: Board = new Board([]);
    topics: Topic[] = [];


    constructor(private api: AtApiService,
        public snackBar: MdSnackBar) {
        this.update();
    }

    async update() {
        try{
            let result = new Board([]);
            let topics = await this.api.findTopicBoard();
            topics.forEach(t => {
                //カレント板
                let board = result;
                t.category.forEach((c, i) => {
                    if (!board.children.has(c)) {
                        let b = new Board(t.category.slice(0, i + 1));
                        board.children = board.children.set(c, b);
                        board = b;
                    } else {
                        board = board.children.get(c);
                    }
                });
                board.topic = t;
            });
            this.board = result;
            this.topics = topics;
        }catch(_e){
        this.snackBar.open("トピック取得に失敗");
        }
    }
}

export class Board {
    topic: Topic = null;
    children = Immutable.OrderedMap<string, Board>();

    constructor(public category: string[]) { }
}