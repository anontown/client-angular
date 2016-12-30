import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'topic-auto-scroll-menu',
    templateUrl: './topic-auto-scroll-menu.component.html'
})
export class TopicAutoScrollMenuComponent implements OnInit {
    @Input()
    isAutoScroll: boolean;

    @Input()
    autoScrollSpeed: number;

    autoScroll() {
        this.isAutoScroll = !this.isAutoScroll;
    }

    constructor() {

    }

    ngOnInit() {

    }
}