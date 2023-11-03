/*
https://stackoverflow.com/questions/63117319/chaining-multiple-observables-and-reusing-results-of-already-executed-ones-in-th/63122716#63122716
I want to combine the following functions a(), b() and c() to get one result.

function a() {
    return rx.of(42);
}

function b(value) {
    return rx.of(value*2);
}

function c(val1, val2) {
    return rx.of({
        original: val1,
        modified: val2
    })
}

These are simplified variants - they would actually be HTTP-requests. 
The result of a is needed for executing b, 
a and b's results are preconditions for executing c. 
The direct equivalent of your example there would be with mergeMap:
*/
a().pipe(
  mergeMap(a =>
    b(a).pipe(
      mergeMap(b => c(a, b))
    )
  )
)
.subscribe(console.log)
//If order is important (once these are something that is asynchronous and not just made with of), then you will want to use concatMap instead. But the overall structure is the same.