import { Config } from '../../config';
import {
  ITokenReqAPI,
  IResAPI,
  ITopicNormalAPI,
  ITopicForkAPI,
  ITopicOneAPI,
  ITopicAPI,
  ITokenAPI,
  IMsgAPI,
  IUserAPI,
  IClientAPI,
  IHistoryAPI,
  IProfileAPI,
  ITokenMasterAPI
} from './api-object';
import { IAuthUser, IAuthToken } from './auth';
import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';


export class IAtError {
  message: string;
  data: any;
}

export class AtError {
  constructor(public statusCode: number,
    public type: string,
    public errors: IAtError[]) {
  }
}

@Injectable()
export class AtApiService {
  static serverURL = Config.serverURL;
  constructor(private http: Http) { }

  private async request<T>(name: string, params: any, authToken: IAuthToken | null, authUser: IAuthUser | null, recaptcha: string | null): Promise<T> {
    var url = AtApiService.serverURL + name;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let res = await this.http.post(url,
      JSON.stringify({ authUser, authToken, recaptcha, params }), {
        headers
      }).toPromise().catch((r: Response) => {
        let data = r.json();
        throw new AtError(r.status, data.type, data.errors);
      });

    return res.json();
  }

  //[res]
  createRes(authToken: IAuthToken,
    params: {
      topic: string,
      name: string,
      text: string,
      reply: string | null,
      profile: string | null,
      age: boolean
    }) {
    return this.request<IResAPI>(
      '/res/create',
      params,
      authToken,
      null,
      null);
  }
  findResOne(authToken: IAuthToken | null,
    params: {
      id: string
    }) {
    return this.request<IResAPI>(
      '/res/find/one',
      params,
      authToken,
      null,
      null);
  }
  findResIn(authToken: IAuthToken | null,
    params: {
      ids: string[]
    }): Promise<IResAPI[]> {
    return this.request<IResAPI[]>(
      '/res/find/in',
      params,
      authToken,
      null,
      null);
  }
  findRes(authToken: IAuthToken | null,
    params: {
      topic: string,
      type: 'before' | 'after',
      equal: boolean,
      date: string,
      limit: number
    }): Promise<IResAPI[]> {
    return this.request<IResAPI[]>(
      '/res/find',
      params,
      authToken,
      null,
      null);
  }
  findResNew(authToken: IAuthToken | null,
    params: {
      topic: string,
      limit: number
    }): Promise<IResAPI[]> {
    return this.request<IResAPI[]>(
      '/res/find/new',
      params,
      authToken,
      null,
      null);
  }
  findResHash(authToken: IAuthToken | null,
    params: {
      topic: string,
      hash: string
    }): Promise<IResAPI[]> {
    return this.request<IResAPI[]>(
      '/res/find/hash',
      params,
      authToken,
      null,
      null);
  }
  findResReply(authToken: IAuthToken | null,
    params: {
      topic: string,
      reply: string
    }): Promise<IResAPI[]> {
    return this.request<IResAPI[]>(
      '/res/find/reply',
      params,
      authToken,
      null,
      null);
  }
  findResNotice(authToken: IAuthToken,
    params: {
      type: 'before' | 'after',
      equal: boolean,
      date: string,
      limit: number
    }): Promise<IResAPI[]> {
    return this.request<IResAPI[]>(
      '/res/find/notice',
      params,
      authToken,
      null,
      null);
  }
  findResNoticeNew(authToken: IAuthToken,
    params: {
      limit: number
    }): Promise<IResAPI[]> {
    return this.request<IResAPI[]>(
      '/res/find/notice/new',
      params,
      authToken,
      null,
      null);
  }
  uvRes(authToken: IAuthToken,
    params: {
      id: string
    }) {
    return this.request<IResAPI>(
      '/res/uv',
      params,
      authToken,
      null,
      null);
  }
  dvRes(authToken: IAuthToken,
    params: {
      id: string
    }) {
    return this.request<IResAPI>(
      '/res/dv',
      params,
      authToken,
      null,
      null);
  }
  cvRes(authToken: IAuthToken,
    params: {
      id: string
    }) {
    return this.request<IResAPI>(
      '/res/cv',
      params,
      authToken,
      null,
      null);
  }
  delRes(authToken: IAuthToken,
    params: {
      id: string
    }) {
    return this.request<IResAPI>(
      '/res/del',
      params,
      authToken,
      null,
      null);
  }

  //[topic]
  createTopicNormal(authToken: IAuthToken,
    params: {
      title: string,
      tags: string[],
      text: string
    }) {
    return this.request<ITopicNormalAPI>(
      '/topic/create/normal',
      params,
      authToken,
      null,
      null);
  }

  createTopicOne(authToken: IAuthToken,
    params: {
      title: string,
      tags: string[],
      text: string
    }) {
    return this.request<ITopicOneAPI>(
      '/topic/create/one',
      params,
      authToken,
      null,
      null);
  }

  createTopicFork(authToken: IAuthToken,
    params: {
      title: string,
      parent: string
    }) {
    return this.request<ITopicForkAPI>(
      '/topic/create/fork',
      params,
      authToken,
      null,
      null);
  }

  findTopicOne(
    params: {
      id: string
    }) {
    return this.request<ITopicAPI>(
      '/topic/find/one',
      params,
      null,
      null,
      null);
  }
  findTopicIn(
    params: {
      ids: string[]
    }): Promise<ITopicAPI[]> {
    return this.request<ITopicAPI[]>(
      '/topic/find/in',
      params,
      null,
      null,
      null);
  }
  findTopicTags(params: { limit: number }): Promise<{ name: string, count: number }[]> {
    return (this.request<{ name: string, count: number }[]>(
      '/topic/find/tags',
      params,
      null,
      null,
      null));
  }
  findTopic(
    params: {
      title: string,
      tags: string[],
      skip: number,
      limit: number,
      activeOnly: boolean
    }): Promise<ITopicAPI[]> {
    return this.request<ITopicAPI[]>(
      '/topic/find',
      params,
      null,
      null,
      null);
  }

  findTopicFork(
    params: {
      parent: string,
      skip: number,
      limit: number,
      activeOnly: boolean
    }): Promise<ITopicForkAPI[]> {
    return this.request<ITopicForkAPI[]>(
      '/topic/find/fork',
      params,
      null,
      null,
      null);
  }

  updateTopic(authToken: IAuthToken,
    params: {
      id: string,
      title: string,
      tags: string[],
      text: string
    }) {
    return this.request<ITopicNormalAPI>(
      '/topic/update',
      params,
      authToken,
      null,
      null);
  }

  //[history]
  findHistoryOne(params: {
    id: string
  }) {
    return this.request<IHistoryAPI>(
      '/history/find/one',
      params,
      null,
      null,
      null);
  }

  findHistoryIn(params: {
    ids: string[]
  }): Promise<IHistoryAPI[]> {
    return this.request<IHistoryAPI[]>(
      '/history/find/in',
      params,
      null,
      null,
      null)
  }

  findHistoryAll(params: {
    topic: string
  }): Promise<IHistoryAPI[]> {
    return this.request<IHistoryAPI[]>(
      '/history/find/all',
      params,
      null,
      null,
      null);
  }
  //[msg]
  findMsgOne(authToken: IAuthToken,
    params: {
      id: string
    }) {
    return this.request<IMsgAPI>(
      '/msg/find/one',
      params,
      authToken,
      null,
      null);
  }
  findMsgIn(authToken: IAuthToken,
    params: {
      ids: string[]
    }): Promise<IMsgAPI[]> {
    return this.request<IMsgAPI[]>(
      '/msg/find/in',
      params,
      authToken,
      null,
      null);
  }
  findMsg(authToken: IAuthToken,
    params: {
      type: 'before' | 'after',
      equal: boolean,
      date: string,
      limit: number
    }): Promise<IMsgAPI[]> {
    return this.request<IMsgAPI[]>(
      '/msg/find',
      params,
      authToken,
      null,
      null);
  }
  findMsgNew(authToken: IAuthToken,
    params: {
      limit: number
    }): Promise<IMsgAPI[]> {
    return this.request<IMsgAPI[]>(
      '/msg/find/new',
      params,
      authToken,
      null,
      null);
  }
  //[profile]
  createProfile(authToken: IAuthToken,
    params: {
      name: string,
      text: string,
      sn: string
    }) {
    return this.request<IProfileAPI>(
      '/profile/create',
      params,
      authToken,
      null,
      null);
  }
  findProfileOne(authToken: IAuthToken | null,
    params: {
      id: string
    }) {
    return this.request<IProfileAPI>(
      '/profile/find/one',
      params,
      authToken,
      null,
      null);
  }
  findProfileIn(authToken: IAuthToken | null,
    params: {
      ids: string[]
    }): Promise<IProfileAPI[]> {
    return this.request<IProfileAPI[]>(
      '/profile/find/in',
      params,
      authToken,
      null,
      null);
  }
  findProfileAll(authToken: IAuthToken): Promise<IProfileAPI[]> {
    return this.request<IProfileAPI[]>(
      '/profile/find/all',
      null,
      authToken,
      null,
      null);
  }
  updateProfile(authToken: IAuthToken,
    params: {
      id: string,
      name: string,
      text: string,
      sn: string
    }) {
    return this.request<IProfileAPI>(
      '/profile/update',
      params,
      authToken,
      null,
      null);
  }
  //[token]
  findTokenOne(authToken: IAuthToken) {
    return this.request<ITokenMasterAPI>(
      '/token/find/one',
      null,
      authToken,
      null,
      null);
  }
  findTokenAll(authToken: IAuthToken): Promise<ITokenAPI[]> {
    return this.request<ITokenAPI[]>(
      '/token/find/all',
      null,
      authToken,
      null,
      null);
  }
  deleteTokenClient(authToken: IAuthToken, params: { client: string }) {
    return this.request<void>(
      '/token/client/delete',
      params,
      authToken,
      null,
      null);
  }
  findTokenClientAll(authToken: IAuthToken) {
    return this.request<IClientAPI[]>(
      '/token/find/client/all',
      null,
      authToken,
      null,
      null);
  }
  createTokenMaster(authUser: IAuthUser) {
    return this.request<ITokenMasterAPI>(
      '/token/create/master',
      null,
      null,
      authUser,
      null);
  }
  createTokenGeneral(authToken: IAuthToken,
    params: {
      client: string
    }) {
    return this.request<ITokenAPI>(
      '/token/create/general',
      params,
      authToken,
      null,
      null);
  }
  setTokenStorage(authToken: IAuthToken,
    params: {
      name: string,
      value: string
    }) {
    return this.request<void>(
      '/token/storage/set',
      params,
      authToken,
      null,
      null);
  }
  getTokenStorage(authToken: IAuthToken,
    params: {
      name: string
    }) {
    return this.request<string>(
      '/token/storage/get',
      params,
      authToken,
      null,
      null);
  }
  delTokenStorage(authToken: IAuthToken,
    params: {
      name: string
    }) {
    return this.request<void>(
      '/token/storage/delete',
      params,
      authToken,
      null,
      null);
  }

  listTokenStorage(authToken: IAuthToken): Promise<string[]> {
    return this.request<string[]>(
      '/token/storage/list',
      null,
      authToken,
      null,
      null);
  }
  createTokenReq(authToken: IAuthToken) {
    return this.request<ITokenReqAPI>(
      '/token/req/create',
      null,
      authToken,
      null,
      null);
  }
  findTokenReq(
    params: {
      id: string,
      key: string
    }) {
    return this.request<ITokenAPI>(
      '/token/find/req',
      params,
      null,
      null,
      null);
  }
  //[user]
  findUserID(
    params: {
      sn: string
    }) {
    return this.request<string>(
      '/user/find/id',
      params,
      null,
      null,
      null);
  }
  findUserSN(
    params: {
      id: string
    }) {
    return this.request<string>(
      '/user/find/sn',
      params,
      null,
      null,
      null);
  }
  createUser(recaptcha: string,
    params: {
      sn: string,
      pass: string
    }) {
    return this.request<IUserAPI>(
      '/user/create',
      params,
      null,
      null,
      recaptcha);
  }
  updateUser(authUser: IAuthUser,
    params: {
      pass: string,
      sn: string
    }) {
    return this.request<IUserAPI>(
      '/user/update',
      params,
      null,
      authUser,
      null);
  }
  //[client]
  createClient(authToken: IAuthToken,
    params: {
      name: string,
      url: string
    }) {
    return this.request<IClientAPI>(
      '/client/create',
      params,
      authToken,
      null,
      null);
  }
  updateClient(authToken: IAuthToken,
    params: {
      id: string,
      name: string,
      url: string
    }) {
    return this.request<IClientAPI>(
      '/client/update',
      params,
      authToken,
      null,
      null);
  }
  findClientOne(authToken: IAuthToken | null,
    params: {
      id: string
    }) {
    return this.request<IClientAPI>(
      '/client/find/one',
      params,
      authToken,
      null,
      null);
  }
  findClientIn(authToken: IAuthToken | null,
    params: {
      ids: string[]
    }) {
    return this.request<IClientAPI[]>(
      '/client/find/in',
      params,
      authToken,
      null,
      null);
  }
  findClientAll(authToken: IAuthToken) {
    return this.request<IClientAPI[]>(
      '/client/find/all',
      null,
      authToken,
      null,
      null);
  }

  authUser(authUser: IAuthUser) {
    return this.request<void>(
      '/user/auth',
      null,
      null,
      authUser,
      null);
  }
}