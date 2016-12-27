import { environment } from '../environments/environment';

export class Config {
    static clientID = environment.production ? "585f98856952f506e3238075" : "585d1498c2c13f04305f0de8";
    static clientURL = environment.production ? "https://anontown.com" : "http://localhost:4100";
    static userURL = environment.production ? "https://user.anontown.com" : "http://localhost:4201";
    static serverURL = environment.production ? "https://api.anontown.com" : "http://localhost:8081";
}