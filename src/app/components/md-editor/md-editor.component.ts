import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  /*Output,
  EventEmitter,*/
  forwardRef
} from '@angular/core';

import { MdPipe } from '../../pipes';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-md-editor',
  templateUrl: './md-editor.component.html',
  styleUrls: ['./md-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MdEditorComponent),
      multi: true
    }
  ]
})
export class MdEditorComponent implements OnInit, ControlValueAccessor {

  constructor() { }

  ngOnInit() {
  }

  @Input()
  label = 'switch';

  @Input('value')
  _value = '';

  mdValue = '';

  onChange = (_value: string) => { };
  onTouched = () => { };

  get value() {
    return this._value;
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

}
