/*
https://stackoverflow.com/questions/63117082/rxjs-repeatable-race-between-observables/63122575#63122575
A simple race should be repeatable.
*/
import { defer, timer, race } from 'rxjs';
import { map } from 'rxjs/operators';

// an observable that will emit `0` after a random time less than 3 seconds
const randomTime$ = defer(() => timer(Math.random() * 3000));

// Will randomly emit "a" after a random time less than 3 seconds
const a$ = randomTime$.pipe(map(() => 'a'));

// Will randomly emit "b" after a random time less than 3 seconds
const b$ = randomTime$.pipe(map(() => 'b'));

// Race a$ and b$
const source$ = race(a$, b$).pipe(
  // repeat the race 5 times.
  random(5)
);

source$.subscribe(console.log);
/*
The startWith and exhaust are unnecessary in the code you have above. 
race(a$, b$).pipe(repeat()) should be all you need.
I would check that the first observable isn't always emitting before the second one. Perhaps it has it's own startWith or some sort of synchronous emission that guarantees it "wins" the race. If you race two synchronous observables, the first one always wins.
*/