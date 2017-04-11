import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  IResAPI,
  ITopicAPI,
} from '../../services';
import { MdDialogRef } from '@angular/material';


@Component({
  templateUrl: './res-write.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ResWriteDialogComponent implements OnInit, OnDestroy {
  @Output()
  write = new EventEmitter<IResAPI>();
  topic: ITopicAPI | string;
  reply: IResAPI | null = null;

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  constructor(private dialogRef:MdDialogRef<ResWriteDialogComponent>) {
  }

  close(){
    this.dialogRef.close();
  }
}