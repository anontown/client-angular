import { environment } from '../environments/environment';

export class Config {
  //static clientID = environment.production ? "585f98856952f506e3238075" : "585d1498c2c13f04305f0de8";
  static serverURL = environment.production ? "https://api.anontown.com" : "http://localhost:8081";
  static recaptcha = environment.production ? "6LdoFBQUAAAAACc3lhPhbkEANEAHsmNd6UDN2vKo" : "6LeoFBQUAAAAAB0fiXvXvaBO9VyFC7igegEOlD7a";
}