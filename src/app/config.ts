import { environment } from '../environments/environment';

export class Config {
  static serverURL = environment.production ? 'https://api.anontown.com' : 'http://localhost:8081';
  static recaptcha = environment.production ? '6LdoFBQUAAAAACc3lhPhbkEANEAHsmNd6UDN2vKo' : '6LeoFBQUAAAAAB0fiXvXvaBO9VyFC7igegEOlD7a';
}