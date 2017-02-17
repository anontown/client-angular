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
import { Behavior2Subject } from './behavior2subject';


@Injectable()
export class UserService {
  ud=new Behavior2Subject<IUserData>();

  constructor(private api: AtApiService,
    public snackBar: MdSnackBar) {
  }

  async login(token: Token) {
    try{
      let auth: IAuthToken = {
        id: token.id,
        key: token.key
      };

      let storageStr="";
      try{
        storageStr=await this.api.getTokenStorage(auth,{name:"main"});
      }catch(_e){
        storageStr="";
      }

      let storage = Storage.fromJSON(storageStr);

      let profiles = Immutable.List(await this.api.findProfileAll(auth));

      this.ud.next({
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

export interface IUserData {
  auth: IAuthToken,
  token: Token,
  storage: Storage,
  profiles: Immutable.List<Profile>
}