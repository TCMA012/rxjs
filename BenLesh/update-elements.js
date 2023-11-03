/*
https://stackoverflow.com/questions/48812163/rxjs-how-should-i-update-elements-in-observable-via-socket-js-event/48892750#48892750

This is actually a common mistake with RxJS, you're using switchMap when you should be using concatMap (or maybe mergeMap).

switchMap is only really safe with non-sideeffectful read-only requests/messages. 
If you're' trying to update record over the network, and you care about the order in which it's done and results are processed, you want to use concatMap. 
If you don't care about the ordering of results, you should use mergeMap.

switchMap - will unsubscribe from any pending Observable when it gets a new value, thus dropping its responses.
mergeMap - will start and run all Observables it creates immediately and to completion, without any care for the order in which results come back as they're merged in.
concatMap - only run one Observable at a time, in order, and drop nothing.
*/
merge(this.filterChange.debounceTime(400), this.socketUpdates)
    .startWith(this.filterComponent.initialValue);
    .concatMap((data) => this.process(data))
    .share();