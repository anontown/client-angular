import { Injectable } from '@angular/core';
import {
  IAuthToken,
  Token,
  Profile,
  AtApiService
} from 'anontown';
import { Storage } from '../storage';
import * as Immutable from 'immutable';


@Injectable()
export class UserService {
  ud: IUserData;
  private udListener = new Set<IUserDataListener>();

  constructor(private api: AtApiService) {
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