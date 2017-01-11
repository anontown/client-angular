import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-topic-auto-scroll-menu',
    templateUrl: './topic-auto-scroll-menu.component.html',
    changeDetection: ChangeDetectionStrategy.Default
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