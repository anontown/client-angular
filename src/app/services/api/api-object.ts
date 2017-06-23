export interface IClientAPI {
  id: string,
  name: string,
  url: string,
  user: string | null
  date: string,
  update: string
}
export interface IHistoryAPI {
  id: string,
  topic: string,
  title: string,
  tags: string[],
  text: string,
  date: string,
  hash: string
}

export type IResAPI = IResNormalAPI | IResHistoryAPI | IResTopicAPI | IResForkAPI | IResDeleteAPI;

export interface IResBaseAPI<T extends ResType> {
  id: string,
  topic: string,
  date: string,
  user: string | null,
  uv: number,
  dv: number,
  hash: string,
  replyCount: number,
  voteFlag: ResVoteFlag | null,
  type: T
}

export interface IResNormalAPI extends IResBaseAPI<"normal"> {
  name: string | null,
  text: string,
  reply: string | null,
  profile: string | null,
  isReply: boolean | null
}

export interface IResHistoryAPI extends IResBaseAPI<"history"> {
  history: string;
}

export interface IResTopicAPI extends IResBaseAPI<"topic"> {
}

export interface IResForkAPI extends IResBaseAPI<"fork"> {
  fork: string;
}

export interface IResDeleteAPI extends IResBaseAPI<"delete"> {
  flag: "self" | "freeze";
}

export type ResVoteFlag = 'uv' | 'dv' | 'not';
export type ResType = "normal" | "history" | "topic" | "fork" | "delete";

export interface IProfileAPI {
  id: string;
  user: string | null;
  name: string;
  text: string;
  date: string;
  update: string;
  sn: string;
}
export interface ITopicNormalAPI {
  id: string;
  title: string;
  tags: string[];
  text: string;
  update: string;
  date: string;
  resCount: number;
  type: 'normal';
  active: boolean;
}

export interface ITopicOneAPI {
  id: string;
  title: string;
  tags: string[];
  text: string;
  update: string;
  date: string;
  resCount: number;
  type: 'one';
  active: boolean;
}

export interface ITopicForkAPI {
  id: string;
  title: string;
  update: string;
  date: string;
  resCount: number;
  type: 'fork';
  active: boolean;
  parent: string;
}

export type TopicType = 'normal' | 'one' | 'fork';
export type ITopicAPI = ITopicOneAPI | ITopicNormalAPI | ITopicForkAPI;
export interface IMsgAPI {
  id: string;
  receiver: string | null;
  text: string;
  date: string;
}


export type TokenType = 'master' | 'general';
export type ITokenAPI = ITokenGeneralAPI | ITokenMasterAPI;

export interface ITokenBaseAPI<T extends TokenType> {
  id: string;
  key: string;
  user: string;
  date: string;
  type: T;
}

export interface ITokenMasterAPI extends ITokenBaseAPI<'master'> {
}

export interface ITokenGeneralAPI extends ITokenBaseAPI<'general'> {
  client: string,
  active: boolean,
}
export interface IUserAPI {
  id: string,
  sn: string
}

export interface ITokenReqAPI {
  token: string,
  key: string
}