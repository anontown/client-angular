import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonDialogComponent implements OnInit {
  message: string;
  actions: { data: any, text: string }[];


  constructor(public dialogRef: MatDialogRef<ButtonDialogComponent>) { }

  ngOnInit() {
  }

}
