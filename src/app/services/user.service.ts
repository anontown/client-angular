import { Injectable } from '@angular/core';
import {
  IAuthToken,
  ITokenMasterAPI,
  AtApiService
} from './api';
import { Storage, StorageJSON, initStorage, toStorage, convert, verArray } from '../storage';
import { MatSnackBar } from '@angular/material';
import { ReplaySubject } from 'rxjs';


@Injectable()
export class UserService {
  ud = new ReplaySubject<IUserData | null>(1);

  constructor(private api: AtApiService,
    public snackBar: MatSnackBar) {
  }

  async login(token: ITokenMasterAPI) {
    try {
      let auth: IAuthToken = {
        id: token.id,
        key: token.key
      };

      let storageJSON: StorageJSON;
      try {
        //ストレージ名一覧
        let storageNames = await this.api.listTokenStorage(auth);
        //ストレージ名一覧にある最も新しいストレージ名を取得
        let name = [...verArray, 'main'].find(ver => storageNames.indexOf(ver) !== -1);
        if (name !== undefined) {
          let jsonStr = await this.api.getTokenStorage(auth, { name });
          storageJSON = JSON.parse(jsonStr);
        } else {
          storageJSON = initStorage;
        }
      } catch (_e) {
        storageJSON = initStorage;
      }

      let storage = toStorage(convert(storageJSON));

      this.ud.next({
        auth,
        token,
        storage
      });
    } catch (_e) {
      this.snackBar.open('ログインに失敗');
    }
  }
}

export interface IUserData {
  auth: IAuthToken;
  token: ITokenMasterAPI;
  storage: Storage;
}