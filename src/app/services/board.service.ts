import { Injectable } from '@angular/core';
import { AtApiService, Topic } from 'anontown';
import * as Immutable from 'immutable';
@Injectable()
export class BoardService {
    board: Board;
    topics: Topic[];


    constructor(private api: AtApiService) {
        this.update();
    }

    async update() {
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
    }

}

export class Board {
    topic: Topic = null;
    children = Immutable.OrderedMap<string, Board>();

    constructor(public category: string[]) { }
}