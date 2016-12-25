import {
    IAuthToken,
    AtApiService,
    Profile,
    Token
} from 'anontown';
import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from './storage';


class UserDataServiceObject {
    authOrNull: Promise<IAuthToken | null>;
    auth: Promise<IAuthToken>;
    profiles: Promise<Profile[]>;
    token: Promise<Token>;
    storage: Promise<Storage>;
    isToken: Promise<boolean>;
    notToken: Promise<boolean>;

    constructor(private api: AtApiService,
        tokenJson: string | null) {
        if (tokenJson !== null) {
            let token: IAuthToken = JSON.parse(tokenJson);

            this.token = this.api.findTokenOne(token);
            this.profiles = this.api.findProfileAll(token);
            this.storage = Storage.fromJSON(this.api, token);
            this.authOrNull = this.token.then(() => token).catch(() => null);
            this.auth = this.authOrNull.then(t => {
                if (t !== null) {
                    return t;
                } else {
                    throw new Error();
                }
            });
            this.isToken = this.authOrNull.then(t => t !== null);
            this.notToken = this.authOrNull.then(t => t === null);
        } else {
            this.authOrNull = Promise.resolve(null);
            this.isToken = Promise.resolve(false);
            this.notToken = Promise.resolve(true);
        }
    }
}

@Injectable()
export class UserDataService {
    udso: UserDataServiceObject;
    updateEvent = new EventEmitter<void>();

    get authOrNull(): Promise<IAuthToken | null> {
        return this.udso.authOrNull;
    }

    get auth(): Promise<IAuthToken> {
        return this.udso.auth;
    }
    get profiles(): Promise<Profile[]> {
        return this.udso.profiles;
    }
    get token(): Promise<Token> {
        return this.udso.token;
    }
    get storage(): Promise<Storage> {
        return this.udso.storage;
    }

    get isToken(): Promise<boolean> {
        return this.udso.isToken;
    }
    get notToken(): Promise<boolean> {
        return this.udso.notToken;
    }

    constructor(private api: AtApiService) {
        this.reset();
    }

    login(token: IAuthToken) {
        localStorage.setItem("token", JSON.stringify({ id: token.id, key: token.key }));
        this.reset();
    }

    logout() {
        localStorage.removeItem("token");
        this.reset();
    }

    reset() {
        this.udso = new UserDataServiceObject(this.api, localStorage.getItem("token"));
        this.updateEvent.next();
    }
}