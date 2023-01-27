import { of, delay, startWith, combineLatest } from 'rxjs';

const observables = [1, 5, 10, 4, 2, 6, 3].map(
  n => of(n).pipe(
    delay(n * 1000), // emit 0 and then emit n after n seconds
    startWith(0)
  )
);
const combined = combineLatest(observables);
combined.subscribe(value => console.log(value));
// Logs
//const observables = [1, 5, 10].map(
// [0, 0, 0] immediately
// [1, 0, 0] after 1s
// [1, 5, 0] after 5s
// [1, 5, 10] after 10s
/*
const observables = [1, 5, 10, 4, 2, 6, 3].map(
[0, 0, 0, 0, 0, 0, 0]
▶[1, 0, 0, 0, 0, 0, 0]
▶[1, 0, 0, 0, 2, 0, 0]
▶[1, 0, 0, 0, 2, 0, 3]
▶[1, 0, 0, 4, 2, 0, 3]
▶[1, 5, 0, 4, 2, 0, 3]
▶[1, 5, 0, 4, 2, 6, 3]
▶[1, 5, 10, 4, 2, 6, 3]
*/
/*
const observables = [1, 5, 10, 4, 2, 6, 3, 7].map(
[0, 0, 0, 0, 0, 0, 0, 0]
▶[1, 0, 0, 0, 0, 0, 0, 0]
▶[1, 0, 0, 0, 2, 0, 0, 0]
▶[1, 0, 0, 0, 2, 0, 3, 0]
▶[1, 0, 0, 4, 2, 0, 3, 0]
▶[1, 5, 0, 4, 2, 0, 3, 0]
▶[1, 5, 0, 4, 2, 6, 3, 0]
▶[1, 5, 0, 4, 2, 6, 3, 7]
▶[1, 5, 10, 4, 2, 6, 3, 7]
*/