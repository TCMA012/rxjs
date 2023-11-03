/*
https://stackoverflow.com/questions/38548407/return-an-empty-observable
EMPTY completes the observable, so it won't trigger next in your stream, but only completes. 
tap might not get trigger as you wish.

of({}) creates an Observable and emits next with a value of {} and then it completes the Observable.
*/
EMPTY.pipe(
    tap(() => console.warn("i will not reach here, as i am complete"))
).subscribe();

of({}).pipe(
    tap(() => console.warn("i will reach here and complete"))
).subscribe();