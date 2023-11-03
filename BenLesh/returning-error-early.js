/*
https://stackoverflow.com/questions/46090924/returning-error-early-from-a-function-that-returns-an-observable/46121464#46121464
there's one red flag I see: In a function that is going to return an observable, there probably shouldn't be a subscribe call unless it's inside the body of another Observable.

What you'll want to do is:

Throw the argument validation error as soon as you can. This enables you to handle it synchronously if you choose, it also means that if you're using it in RxJS (for example, in a switchMap) it will still propagate down the error channel of the observable.
Chain your validHeadersObs call into the next action you'd like to take. This is actually no different than what you'd need to do with a promise (think validate.then(returnAthing), validate.map(returnAthing) isn't much different in this case).
The problem in your current code is you're starting that work by subscribing, it's async so it doesn't return, then you carry on and return the "happy path" observable. If returning the "happy path" observable depends on the async feedback from your validation call, you'll need to chain it.

(Small note, if any of the tsv processing logic happens to be asynchronous, you'll want to use a switchMap instead of a map)

This should do it:
*/
public readTsv(tsv: string): Observable<TsvAsObject> {
  if (!tsv || tsv.length < 1) {
    // throw an error as soon as you can
    throw new TypeError('null or empty tsv file passed');
  }

  // check tsv headers
  return this.validHeadersObs(tsv.split('\n')[0]) 
    .map(valid => {
      if (!valid) {
        throw new Error('invalid tsv headers');
      }

      // omitted logic that processes the tsv here

      return tsvAsObject
    });
}