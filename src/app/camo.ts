import * as CryptoJS from 'crypto-js';

export function getHttpsUrl(url:string):string{
    //既にHTTPSなら
    if(url.indexOf("https://")===0){
        return url;
    }

    const key = '0x24FEEDFACEDEADBEEFCAFE';

    let digest = CryptoJS.HmacSHA1(url,key);
    let urlEncode = encodeURIComponent(url);

    return 'https://camo.anontown.com/' + digest + '?url=' + urlEncode;
}