import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class ImgurApiService {

  constructor(private http: Http) {
  }

  async upload(data: Blob | FormData): Promise<string> {
    let result = await this.http.post("https://api.imgur.com/3/image", data, {
      headers: new Headers({ Authorization: 'Client-ID 042fd78266ccaaf' })
    }).toPromise();
    return JSON.parse(result.text()).data.link;
  }

}