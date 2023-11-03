/*
https://stackoverflow.com/questions/63978140/rxjs-combineall-detailed-explanation
https://www.learnrxjs.io/learn-rxjs/operators/combination/combineall
2 values from source will map to 2 (inner) interval observables that emit every 1s.
combineAll uses combineLatest strategy, emitting the last value from each
whenever either observable emits a value
*/
// emit every 1s, take 2
const source$ = interval(1000).pipe(take(2));
// map each emitted value from source to interval observable that takes 5 values
const example$ = source$.pipe(
  map(val =>
    interval(1000).pipe(
      map(i => `Result (${val}): ${i}`),
      take(5)
    )
  )
);

example$
  .pipe(combineAll())
  .subscribe(console.log);
/*
  output:
  ["Result (0): 0", "Result (1): 0"]
  ["Result (0): 1", "Result (1): 0"]
  ["Result (0): 1", "Result (1): 1"]
  ["Result (0): 2", "Result (1): 1"]
  ["Result (0): 2", "Result (1): 2"]
  ["Result (0): 3", "Result (1): 2"]
  ["Result (0): 3", "Result (1): 3"]
  ["Result (0): 4", "Result (1): 3"]
  ["Result (0): 4", "Result (1): 4"]

The explanation at learnRxJS and this StackOverflow question are not getting to my head that well.

Areas of ambiguity:

Why does first output show: ["Result (0): 0", "Result (1): 0"] instead of ["Result (0): 0"]
Because in the First 1000ms, "1" should not have been emitted from the source right?.

Why are we getting values like: ["Result (0): 1", "Result (1): 0"]
Shoulnt it be.. ["Result (0): 1", "Result (1): 1"]

According to the definition of combineAll, "Flattens an Observable-of-Observables by applying combineLatest when the Observable-of-Observables completes"
I dont really understand how it "Flattens" and Why we receive the output as individual array in 9 installments.
*/
/*
Your assumption would be correct, but there is one catch with combineAll. This is from the docs: 
"Once the outer Observable completes, it subscribes to all collected Observables". 
i.e.
const source$ = interval(1000).pipe(take(2)); 
has to complete in order to make combineAll subscribe to the inner Observables. 
Due to take(2) it completes in one second with values 0 and 1.



To answer second and third questions:
What's the type of example$? 
*/
const example$ = source$.pipe(map(val => ...))
/*
source$ is Observable<number> due to the interval. 
When we map the value emitted by the source Observable to the new interval we are going to have Observable of Observables. Thus the type of 
example$ is Observable<Observable<number>>. We don't want to subscribe to this type, because in that case we will receive the Observable<number> in the subscribe and its not what we want. That's where 
combineAll comes handy, it 
flattens Observable<Observable<number>> to Observable<number>.

In different perspective, 
combineAll essentially is same as the combineLatest. Lets explain the resulted behavior in terms of combineLatest.

const source$ = interval(1000).pipe(take(2));
source Observable emits 2 items and completes. We are mapping this 2 events to the 2 inner Observables. In summary, we have 2 inner Observables, lets name them inner0$ and inner1$.

As for comparison this is where combineLatest comes in. This is how we would write same code with combineLatest.

combineLatest([inner0$, inner1$])
  .subscribe(console.log);
Finally, whenever either of the inner0$ or inner1$ emits we get the console.log (Note: at the beginning both Observables should emit at least 1 value, otherwise combineLatest won't emit anything)

Both inner stream are essentially the same, so let's visualize the streams and the console logs for the combineLatest

---- = 1 second

inner0$: 0----1----2----3----4

inner1$: 0----1----2----3----4

combineLatest: [0,0]----[1,0][1,1]----[2,1][2,2]----[3,2][3,3]----[4,3][4,4]
*/
/*
https://stackoverflow.com/questions/45181884/rxjs-combineall-operator-explanation
Consider that combineAll:

flattens an Observable-of-Observables by applying combineLatest when the Observable-of-Observables completes.

And that combineLatest;

will actually wait for all input Observables to emit at least once.

So the first emission from the combineAll observable that includes the first value of the "Inner 1" observable is not going to happen until the "Inner 2" observable emits its first value. So there will only be nine emissions - not ten.
*/