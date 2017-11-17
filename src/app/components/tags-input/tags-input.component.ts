import {
  Component,
  OnInit,
  Input,
  forwardRef,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as Immutable from 'immutable';
import { AtApiService } from '../../services';
import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tags-input',
  templateUrl: './tags-input.component.html',
  styleUrls: ['./tags-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagsInputComponent),
      multi: true
    }
  ]
})
export class TagsInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  //入力との比較
  stateCtrl = new FormControl();
  filteredStates: any;

  filterStates(val: string) {
    return val ?
      this.list
        .filter(l => l.name.toLowerCase().indexOf(val.toLocaleLowerCase()) !== -1)
      : this.list;
  }


  //選択時
  isSelect = false;
  change() {
    if (this.isSelect) {
      setTimeout(() => this.ok());
      this.isSelect = false;
    }
  }

  select() {
    this.isSelect = true;
  }

  get tags(): Immutable.Set<string> {
    return Immutable.Set(this.value.length !== 0 ? this.value.split(/ /) : []);
  }

  set tags(val: Immutable.Set<string>) {
    this.value = val.join(' ');
  }

  list: { name: string, count: number }[];

  ok() {
    if (this.tag.length !== 0) {
      this.tags = this.tags.add(this.tag.toLowerCase());
      this.tag = '';
    }
  }

  del(val: string) {
    this.tags = this.tags.delete(val);
  }

  tag = '';

  constructor(private api: AtApiService,
    public snackBar: MatSnackBar) { }

  ngOnDestroy() {
  }

  async ngOnInit() {
    try {
      this.list = await this.api.findTopicTags({ limit: 100 });
      this.filteredStates = this.stateCtrl.valueChanges
        .startWith(null)
        .map(name => this.filterStates(name));
    } catch (_e) {
      console.log(_e);
      this.snackBar.open('タグ一覧取得に失敗');
    }
  }

  tagChange(e: KeyboardEvent) {
    if (e.keyCode === 32) {
      this.ok();
      return false;
    } else {
      return true;
    }
  }


  @Input('value')
  _value = '';

  onChange = (_value: string) => { };
  onTouched = () => { };

  get value() {
    return this._value;
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
    if (typeof value === 'string' && this.value !== value) {
      this.value = value;
    }
  }
}