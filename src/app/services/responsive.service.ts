import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Behavior2Subject } from './Behavior2Subject';

@Injectable()
export class ResponsiveService {
  size = new Behavior2Subject<"sm" | "lg">();

  constructor() {
    Observable.fromEvent<void>(window, "resize")
      .startWith(null)
      .subscribe(() => {
        if (window.innerWidth <= 767) {
          this.size.next("sm");
        } else {
          this.size.next("lg");
        }
      });
  }
}