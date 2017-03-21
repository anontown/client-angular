import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonDialogComponent implements OnInit {
  message: string;
  actions: { data: any, text: string }[];


  constructor(public dialogRef: MdDialogRef<ButtonDialogComponent>) { }

  ngOnInit() {
  }

}
