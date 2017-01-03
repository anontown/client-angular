import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-button-dialog',
  templateUrl: './button-dialog.component.html',
  styleUrls: ['./button-dialog.component.scss']
})
export class ButtonDialogComponent implements OnInit {
  message: string;
  actions: { data: any, text: string }[];


  constructor(public dialogRef: MdDialogRef<ButtonDialogComponent>) { }

  ngOnInit() {
  }

}
