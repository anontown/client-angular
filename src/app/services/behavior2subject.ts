import {
  Subject,
  Subscriber,
  Subscription,
  ObjectUnsubscribedError
} from 'rxjs';

//初期値のないBehaviorSubject
export class Behavior2Subject<T> extends Subject<T> {
  private _value: T;
  private _isInit = false;

  constructor() {
    super();
  }

  get value(): T {
    return this.getValue();
  }

  protected _subscribe(subscriber: Subscriber<T>): Subscription {
    const subscription = super._subscribe(subscriber);
    if (subscription && !subscription.closed && this._isInit) {
      subscriber.next(this._value);
    }
    return subscription;
  }

  getValue(): T {
    if (this.hasError) {
      throw this.thrownError;
    } else if (this.closed) {
      throw new ObjectUnsubscribedError();
    } else {
      return this._value;
    }
  }

  next(value: T): void {
    this._value = value;
    this._isInit = true;

    super.next(value);
  }
}