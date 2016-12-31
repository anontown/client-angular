import { Injectable } from '@angular/core';
import {
    IAuthToken
} from 'anontown';

@Injectable()
export class UserService {
    private auth: IAuthToken = null;
    private authListener = new Set<IAuthListener>();

    constructor() {
    }

    addAuthListener(call: IAuthListener): IAuthListener {
        this.authListener.add(call);
        call(this.auth);
        return call;
    }

    removeAuthListener(call: IAuthListener) {
        this.authListener.delete(call);
    }

    setAuth(auth: IAuthToken) {
        this.auth = auth;
        this.authListener.forEach(f => f(auth));
    }
}

export interface IAuthListener {
    (auth: IAuthToken): void
}