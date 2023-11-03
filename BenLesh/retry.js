/*
https://stackoverflow.com/questions/58446368/retry-for-rxjs-in-nestjs/58458049#58458049
With the retry operator, it will not forward the errors to your error handler until all attempts to retry are exhausted. So it's retrying, it's just your expectations are off with how errors are going to be logged. If you want to log errors as they happen before the retry, you'd need to use tap to produce a side effect before the retry:
*/
source$.pipe(
   tap({ error: err => console.log('error: ', err.message) }),
   retry(5),
)
.subscribe({
  next: value => console.log(value),
  error: err => console.log('only fires once ', err.message),
});
/*
Also, it doesn't make sense to await source$.subscribe(), because in doing so, your function will just return Promise<Subscription>. subscribe does not return a Promise. You might be looking for Observable.prototype.forEach(), however, be warned, using that will forgo cancellation, as it doesn't return a Subscription to unsubscribe with.
*/