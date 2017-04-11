import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  Res,
  Topic,
} from '../../services';
import { MdDialogRef } from '@angular/material';


@Component({
  templateUrl: './res-write.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ResWriteDialogComponent implements OnInit, OnDestroy {
  @Output()
  write = new EventEmitter<Res>();
  topic: Topic | string;
  reply: Res | null = null;

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