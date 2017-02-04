import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    templateUrl: './topic-auto-scroll-menu.dialog.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class TopicAutoScrollMenuDialogComponent implements OnInit {
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