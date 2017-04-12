import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { IClientAPI, UserService } from '../../services';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  @Input()
  client: IClientAPI;

  constructor(public user: UserService) {
    
  }

  ngOnInit() {
  }

  isEdit = false;
  edit() {
    this.isEdit = !this.isEdit;
  }

  ok(client: IClientAPI) {
    this.isEdit = false;
    this.client = client;
  }
}
