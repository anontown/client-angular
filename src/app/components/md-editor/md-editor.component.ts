import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  forwardRef,
  ViewChild,
  ElementRef,
  ChangeDetectorRef, 
  Output,
  EventEmitter
} from '@angular/core';
import {MdSnackBar} from '@angular/material';
import { Http,Headers } from '@angular/http';
import { MdPipe } from '../../pipes';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-md-editor',
  templateUrl: './md-editor.component.html',
  styleUrls: ['./md-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MdEditorComponent),
      multi: true
    }
  ]
})
export class MdEditorComponent implements OnInit, ControlValueAccessor {
  @Output()
  tefocus=new EventEmitter();

  @Output()
  teblur=new EventEmitter();

  constructor(private http:Http,
  public cdr: ChangeDetectorRef,
  public snackBar: MdSnackBar) { }

  ngOnInit() {
  }

  @Input('value')
  _value = '';

  mdValue = '';

  onChange = (_value: string) => { };
  onTouched = () => { };

  get value() {
    return this._value;
  }

  @ViewChild('img')
  img:ElementRef;
  async upload(){
    let el:HTMLInputElement=this.img.nativeElement;
    if(el.files.length!==0){
      let formData = new FormData();
      formData.append('image', el.files[0]);
      await this.imgur(formData);
    }
  }

  private async imgur(blob:Blob|FormData){
    try{
        let result=await this.http.post("https://api.imgur.com/3/image",blob,{
          headers:new Headers({Authorization:'Client-ID 042fd78266ccaaf'}) 
        }).toPromise();
        this.value+=`![](${JSON.parse(result.text()).data.link})`;
      }catch(e){
        this.snackBar.open("画像投稿に失敗");
      }
  }

  tabChange(event: MdTabChangeEvent) {
    if (event.index === 1) {
      this.mdValue = new MdPipe().transform(this._value);
    }
  }

  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  registerOnChange(fn: (value: string) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  writeValue(value: string) {
    if (value) {
      this.value = value;
    }
  }

  isOekaki=false;
  oekaki(){
    this.isOekaki=!this.isOekaki;
  }
}
