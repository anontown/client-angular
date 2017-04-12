import { Injectable } from '@angular/core';
import {
  IAuthToken,
  ITokenMasterAPI,
  AtApiService
} from './api';
import { Storage } from '../storage';
import { MdSnackBar } from '@angular/material';
import { Behavior2Subject } from './behavior2subject';


@Injectable()
export class UserService {
  ud = new Behavior2Subject<IUserData>();

  constructor(private api: AtApiService,
    public snackBar: MdSnackBar) {
  }

  async login(token: ITokenMasterAPI) {
    try {
      let auth: IAuthToken = {
        id: token.id,
        key: token.key
      };

      let storageStr = "";
      try {
        storageStr = await this.api.getTokenStorage(auth, { name: "main" });
      } catch (_e) {
        storageStr = "";
      }

      let storage = Storage.fromJSON(storageStr);

      this.ud.next({
        auth,
        token,
        storage
      });
    } catch (_e) {
      this.snackBar.open("ログインに失敗");
    }
  }
}

export interface IUserData {
  auth: IAuthToken,
  token: ITokenMasterAPI,
  storage: Storage
}