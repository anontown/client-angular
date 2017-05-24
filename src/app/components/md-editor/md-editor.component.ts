import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  forwardRef,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdTabChangeEvent, MdDialog } from '@angular/material';
import {
  ImageUploadDialogComponent,
  OekakiDialogComponent
} from '../../dialogs';

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
export class MdEditorComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  constructor(private dialog: MdDialog) { }

  @Input()
  maxRows: number | null = null;

  @Input()
  minRows = 5;

  rows: number;

  ngOnInit() {
    this.rows = this.minRows;
  }

  ngAfterViewInit() {
  }

  @Input('value')
  _value = '';

  onChange = (_value: string) => { };
  onTouched = () => { };

  get value() {
    return this._value;
  }

  image() {
    this.dialogOpen(ImageUploadDialogComponent);
  }

  oekaki() {
    this.dialogOpen(OekakiDialogComponent);
  }

  dialogOpen(com: any) {
    this.dialog.open(com)
      .afterClosed()
      .filter(url => typeof url === 'string')
      .subscribe(url => {
        this.value += `![](${url})`;
      });
  }

  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();

    let rows = this.value.length !== 0
      ? this.value.split(/\r\n|\r|\n/).length
      : 1;

    rows = Math.max(this.minRows, rows);

    if (this.maxRows !== null) {
      rows = Math.min(this.maxRows, rows);
    }

    this.rows = rows;
  }

  registerOnChange(fn: (value: string) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  writeValue(value: string) {
    if (typeof value === 'string') {
      this.value = value;
    }
  }

  isPreview = false;
}
