/*
https://stackoverflow.com/questions/46940781/do-side-effect-if-observable-has-not-emitted-a-value-within-x-amount-of-time/46978876#46978876
if an observable has not emitted a value within a certain amount of time then we should do some side effect.

use case:
open web socket connection
if no message has been sent/received within X time then close web socket connection and notify user
This requires for a timer to be initiated on every emitted value and upon initial subscription of observable which will then run some function after the allotted time or until a value is emitted in which the timer resets.

If someSource$ notifies faster than timer(5000) (5 seconds), then someSource$ "wins" and lives on.

race (deprecated)
*/
timer(5000).race(someSource$)
  .subscribe(notifyUser);

//If you only want one value from someSource$, you can obviously have a take(1) or first() on someSource$ and that will solve that issue.