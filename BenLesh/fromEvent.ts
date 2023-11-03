/*
https://stackoverflow.com/questions/69377066/can-any-one-please-tell-me-the-difference-between-fromevent-observable-and-butto/69409119

fromEvent just wraps the addEventListener and removeEventListener calls in an Observable. Such that it will addEventListener when subscribed, and removeEventListener when unsubscribed:

Basically:
*/
import { Observable, take } from 'rxjs';

function fromEvent(target, type) {
  return new Observable(subscriber => {
    const handler = e => subscriber.next(e);
    console.log('event listener added');
    target.addEventListener(type, handler);
    return () => {
      console.log('event listener removed');
      target.removeEventListener(type, handler);
    };
  });
}

const clicks$ = fromEvent(button, 'click');

clicks$.pipe(take(3)).subscribe(console.log);