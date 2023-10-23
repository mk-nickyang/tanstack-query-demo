type EventCallback<T> = (data: T) => void;

type Listeners = {
  [event: string]: EventCallback<any>[];
};

export class EventEmitter {
  _listeners: Listeners = {};

  addListener<T = any>(event: string, callback: EventCallback<T>) {
    if (!this._listeners[event]) {
      this._listeners[event] = [callback];
    } else {
      this._listeners[event].push(callback);
    }
    return event;
  }

  removeListener(event: string) {
    delete this._listeners[event];
  }

  removeAllListeners() {
    this._listeners = {};
  }

  emit<T = any>(event: string, data?: T): void {
    if (Array.isArray(this._listeners[event])) {
      this._listeners[event].forEach((cb) => {
        cb(data);
      });
    }
  }
}
