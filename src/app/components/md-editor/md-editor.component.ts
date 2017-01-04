import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  /*Output,
  EventEmitter,*/
  forwardRef
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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

  constructor() { }

  ngOnInit() {
  }

  @Input()
  label = 'switch';

  @Input('value')
  _value = "";

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
    if (value) {
      this.value = value;
    }
  }

}
