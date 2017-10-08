import * as CryptoJS from 'crypto-js';
import { Config } from "./config";

export function getHttpsUrl(url: string): string {
  //既にHTTPSなら
  if (url.indexOf('https://') === 0) {
    return url;
  }

  let digest = CryptoJS.HmacSHA1(url, Config.camo.key);
  let urlEncode = encodeURIComponent(url);

  return `${Config.camo.origin}/${digest}?${url}=${urlEncode}`;
}