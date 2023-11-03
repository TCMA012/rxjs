/*
https://stackoverflow.com/questions/60402820/dynamically-changed-polling-interval/60418196#60418196
I have a drop-down selector which affects this.pollingInterval. Also, I have this.pollDataSource$ which is a BehaviorSubject<number>. It emits a number which is being used as the duration before the next poll.

When this.pollDataSource$ emits -1 (it happens when the user clicks the Refresh button), the data source must be polled immediately, disregarding what polling interval is set.

When this.pollDataSource$ emits some positive number (it happens when a user selects a certain polling interval from the drop-down selector), this number must be used as the duration before the next refresh.

When this.pollDataSource$ emits 0 (it happens when a user selects the Stop Polling option in the same drop-down selector), we must stop polling until the user selects a new polling interval.



If you're wanting to poll on an interval consider the trying the following:
*/
const intervalDelays$ = new BehaviorSubject(10000);

intervalDelays.pipe(
  switchMap(ms => ms === 0 ? EMPTY : interval(ms).pipe(
    concatMap(() => fetchDataObservableHere$)
  ))
);
/*
interval uses a setInterval under the hood. Just be sure that ms is longer than fetchDataObservableHere$ takes to complete. Otherwise you'll end up with backpressure issues.

If backpressure is a concern, you can do this:
*/
const intervalDelays$ = new BehaviorSubject(10000);

intervalDelays.pipe(
  switchMap(ms => ms < 0
    // No wait? We'll assume it's "off"
    ? EMPTY
    // just an observable to start the recursive expand call.
    // 'start' doesn't matter. Could be `true` or anything, really.
    : of('start').pipe(
      expand(() => timer(ms).pipe(
        switchMap(() => fetchDataObservableHere$),
        tap(data => {
          // PROCESS DATA HERE
          // this ensures that it's done processing before you move on.
        }),
      )),
  ))
);
/*
The above code will see incoming changes to the delay of the interval, and start a new inner observable that will recursively execute in such a way that it will wait for each value to come back and be processed before making another request.
*/