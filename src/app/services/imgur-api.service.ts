import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Config } from "../config";

@Injectable()
export class ImgurApiService {

  constructor(private http: Http) {
  }

  async upload(data: Blob | FormData): Promise<string> {
    let result = await this.http.post('https://api.imgur.com/3/image', data, {
      headers: new Headers({ Authorization: `Client-ID ${Config.imgur.clientID}` })
    }).toPromise();
    return JSON.parse(result.text()).data.link;
  }

}