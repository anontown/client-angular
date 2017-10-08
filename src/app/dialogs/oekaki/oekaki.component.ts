import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output
} from '@angular/core';

import * as Immutable from 'immutable';
import { MatDialogRef } from '@angular/material';
import { ImgurApiService } from '../../services';

@Component({
  selector: 'app-dialog-oekaki',
  templateUrl: './oekaki.component.html',
  styleUrls: ['./oekaki.component.scss']
})
export class OekakiDialogComponent implements OnInit, AfterViewInit {
  readonly w = 320;
  readonly h = 240;

  private cmd: Command<ImageData>;

  now: 'posting' | 'error' | null;

  async ok() {
    let blob = await new Promise<Blob>((resolve) => {
      (this.canvas.nativeElement as HTMLCanvasElement)
        .toBlob((result) => {
          resolve(result);
        });
    });

    if (blob) {
      try {
        this.now = 'posting';
        let url = await this.imgur.upload(blob);
        this.now = null;
        this.dialog.close(url);
      } catch (_e) {
        this.now = 'error';
      }
    }
  }


  @ViewChild('canvas')
  canvas: ElementRef;

  ctx: CanvasRenderingContext2D;

  constructor(private dialog: MatDialogRef<OekakiDialogComponent>,
    private imgur: ImgurApiService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.w, this.h);

    this.cmd = new Command<ImageData>(this.image);
  }

  private get image(): ImageData {
    return this.ctx.getImageData(0, 0, this.w, this.h);
  }

  private set image(val: ImageData) {
    this.ctx.putImageData(val, 0, 0);
  }

  isDraw = false;
  color = '#000000';
  //太さ
  lineWidth = 3;

  oldX: number;
  oldY: number;
  mousedown(e: MouseEvent) {
    this.isDraw = true;
    this.oldX = e.clientX;
    this.oldY = e.clientY;
  }
  mouseup() {
    this.cmd.change(this.image);
    this.isDraw = false;
  }
  mousemove(e: MouseEvent) {
    //もしクリック中でなければ何もしない
    if (!this.isDraw) {
      return;
    }

    let x = e.clientX;
    let y = e.clientY;

    this.draw(this.oldX, this.oldY, x, y);

    this.oldX = x;
    this.oldY = y;
  }

  private draw(x1: number, y1: number, x2: number, y2: number) {
    //キャンバスの座標
    let rect = (<Element>this.canvas.nativeElement).getBoundingClientRect();

    //色と太さ
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;

    //描画
    this.ctx.beginPath();
    this.ctx.moveTo(x1 - rect.left, y1 - rect.top);
    this.ctx.lineTo(x2 - rect.left, y2 - rect.top);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  touchstart(e: TouchEvent) {
    e.preventDefault();

    let touch = e.changedTouches[0];

    this.oldX = touch.clientX;
    this.oldY = touch.clientY;
  }

  touchmove(e: TouchEvent) {
    e.preventDefault();

    let touch = e.changedTouches[0];
    let x = touch.clientX;
    let y = touch.clientY;

    this.draw(this.oldX, this.oldY, x, y);

    this.oldX = x;
    this.oldY = y;
  }

  touchend() {
    this.cmd.change(this.image);
  }

  undo() {
    this.cmd.undo();
    this.image = this.cmd.value;
  }

  redo() {
    this.cmd.redo();
    this.image = this.cmd.value;
  }

}

class Command<T>{
  private history: Immutable.List<T>;
  private index: number;

  constructor(val: T) {
    this.history = Immutable.List<T>([val]);
    this.index = 0;
  }

  get value(): T {
    return this.history.get(this.index);
  }

  undo() {
    if (this.index === 0) {
      return;
    }
    this.index--;
  }

  redo() {
    if (this.index === this.history.size - 1) {
      return;
    }
    this.index++;
  }

  change(val: T) {
    this.history = this.history.slice(0, this.index + 1).toList().push(val);
    this.index++;
  }
}