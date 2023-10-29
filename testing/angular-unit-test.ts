/*
https://stackoverflow.com/questions/59463528/angular-unit-test-how-to-use-marble-testing-rxjs-testing-to-test-this-state-m
Your set up could be quite hard to test using RxJS marbles.

The first issue is that you're sending some stuff down the stream before subscribing to it. Remember, expectObservable() synchronously subscribes to a passed observable (in your case nameStateService.filteredNames$). But, no data is sent there since you've already sent it by calling nameStateService.updateFilteredNames(mockNames).

You could think about having these two lines change positions, but remember that this is synchronous execution environment, so doing this
*/
expectObservable(nameStateService.filteredNames$).toBe("-b", {b: mockNames});
nameStateService.updateFilteredNames(mockNames);
/*
wouldn't help either since expectObservable() would subscribe to nameStateService.filteredNames$, then it would read all the values, but since there's no values as you're sending them in a line after this, an actual array would be empty.

To avoid this, you should mock your nameStateService.filteredNames$ observable. To do it, you could do two things, but both of them having their own issues. So, the second issue with your set up is that you could make cold or hot Observable and use them instead of filteredNames$ Observable.

This could be achieved like this:
*/
nameStateService.filteredNames$ = hot('-b', { a: mockNames });
/*
but this errors with TS2540: Cannot assign to 'filteredNames$' because it is a read-only property. since you don't have setter for filteredNames$. If you'd add setter, then this would break your contract of having this._filteredNamesObs$ as private property that is created from this._filteredNames$ Subject.

The other way would be to mock this._filteredNames$ using Jasmine spies (which is a third issue), but this set up is also having problems. 
What to mock? The whole nameStateService? In this case, you'd have to create spies for every particular property and function of the service. Or mock nameStateService._filteredNames$ property? Or even better, nameStateService.filteredNames$? But mocking them would cause others to behave differently since not all of them are mocked.

So, I would suggest not using TestScheduler at all, and writing your test like this:
*/
it('should return a valid names observables', () => {
  const values: Name[][] = [];
  expect(values).toEqual([]);
  nameStateService.updateFilteredNames([{ group: 'G', title: 'Before subscribe' }]);
  expect(values).toEqual([]);

  nameStateService.filteredNames$.subscribe({
    next(names) {
      values.push(names);
    }
  });
  expect(values).toEqual([]);

  nameStateService.updateFilteredNames([{ group: 'G', title: 'After subscribe' }]);
  expect(values).toEqual([[{ group: 'G', title: 'After subscribe' }]]);
});
/*
However, another solution could be present (if you really, really want to use marbles), you'd just have to be very careful and know what you're doing. You could change _filteredNames$ to a ReplaySubject.
*/
private _filteredNames$: Subject<Name[]> = new ReplaySubject();
/*
This would cause any subsequent subscribers to get all the values that are sent down the stream even before subscribing to it. You'd just have to delete one char (- sign that is passed to toBe method, and your passing test would look like this:
*/
it('should return a valid names observables', () => {
  scheduler.run(({ cold, hot, expectObservable }) => {
    const mockNames: Name[] = [{
      title: 'title1',
      group: 'group1'
    }];
    nameStateService.updateFilteredNames(mockNames);
    expectObservable(nameStateService.filteredNames$).toBe('b', {b: mockNames});
  });
});