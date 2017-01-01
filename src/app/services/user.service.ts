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
    private ud: IUserData = null;
    private udListener = new Set<IUserDataListener>();

    constructor(private api: AtApiService) {
    }

    addUserDataListener(call: IUserDataListener): IUserDataListener {
        this.udListener.add(call);
        call(this.ud, true);
        return call;
    }

    removeUserDataListener(call: IUserDataListener) {
        this.udListener.delete(call);
    }

    setUserData(ud: IUserData) {
        this.ud = ud;
        this.udListener.forEach(f => f(ud, (ud ? ud.auth.id : null) !== (this.ud ? this.ud.auth.id : null)));
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
    (data: IUserData, isChange: boolean): void
}

export interface IUserData {
    auth: IAuthToken,
    token: Token,
    storage: Storage,
    profiles: Immutable.List<Profile>
}