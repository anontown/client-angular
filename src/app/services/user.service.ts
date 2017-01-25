import { Injectable } from '@angular/core';
import {
  IAuthToken,
  Token,
  Profile,
  AtApiService
} from 'anontown';
import { Storage } from '../storage';
import * as Immutable from 'immutable';
import {MdSnackBar} from '@angular/material';


@Injectable()
export class UserService {
  ud: IUserData;
  private udListener = new Set<IUserDataListener>();

  constructor(private api: AtApiService,
    public snackBar: MdSnackBar) {
  }

  addUserDataListener(call: IUserDataListener): IUserDataListener {
    this.udListener.add(call);
    if (this.ud !== undefined) {
      call();
    }
    return call;
  }

  removeUserDataListener(call: IUserDataListener) {
    this.udListener.delete(call);
  }

  updateUserData() {
    this.udListener.forEach(f => f());
  }

  setUserData(ud: IUserData) {
    this.ud = ud;
    this.updateUserData();
  }

  async login(token: Token) {
    try{
      let auth: IAuthToken = {
        id: token.id,
        key: token.key
      };

      let storage = Storage.fromJSON(await this.api.getTokenStorage(auth));

      let profiles = Immutable.List(await this.api.findProfileAll(auth));

      this.setUserData({
        auth,
        token,
        storage,
        profiles
      });
    }catch(_e){
      this.snackBar.open("ログイン取得に失敗");
    }
  }
}

export interface IUserDataListener {
  (): void
}

export interface IUserData {
  auth: IAuthToken,
  token: Token,
  storage: Storage,
  profiles: Immutable.List<Profile>
}