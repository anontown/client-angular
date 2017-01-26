import { Component,
  OnInit,
  ViewChild,
  EventEmitter,
  ElementRef,
  AfterViewInit,
  Output} from '@angular/core';

@Component({
  selector: 'app-oekaki',
  templateUrl: './oekaki.component.html',
  styleUrls: ['./oekaki.component.scss']
})
export class OekakiComponent implements OnInit ,AfterViewInit{
  readonly w=320
  readonly h=240

  @Output()
  ok=new EventEmitter<Blob>();
  clickOK(){
    (this.canvas.nativeElement as HTMLCanvasElement)
    .toBlob((blob)=>this.ok.emit(blob));
  }


  @ViewChild("canvas")
  canvas:ElementRef;

  ctx:CanvasRenderingContext2D;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.ctx=this.canvas.nativeElement.getContext("2d");

    this.ctx.fillStyle="#fff";
    this.ctx.fillRect(0,0,this.w,this.h);
  }

  isDraw=false;
  color={r:0,g:0,b:0};
  //太さ
  lineWidth=3;

  oldX:number;
  oldY:number;
  mousedown(e:any){
    this.isDraw=true;
    this.oldX=e.clientX;
    this.oldY=e.clientY;
  } 
  mouseup(){
    this.isDraw=false;
  }
  mousemove(e:any){
    //もしクリック中でなければ何もしない
    if(!this.isDraw){
      return;
    }

    let x:number=e.clientX;
    let y:number=e.clientY;

    //色と太さ
    this.ctx.strokeStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},1)`;
    this.ctx.lineWidth = this.lineWidth;

    //キャンバスの座標
    let rect=this.canvas.nativeElement.getBoundingClientRect();

    //描画
    this.ctx.beginPath();
    this.ctx.moveTo(this.oldX-rect.left, this.oldY-rect.top);
    this.ctx.lineTo(x-rect.left, y-rect.top);
    this.ctx.stroke();
    this.ctx.closePath();

    this.oldX=x;
    this.oldY=y;
  }

}
