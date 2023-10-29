//https://stackoverflow.com/questions/61730747/rxjs-test-for-multiple-values-from-the-stream
scheduler.run(({ expectObservable, cold }) => {
  const t1 = new TestObject();
  const t2 = new TestObject();
  const objectStateContainer = new ObjectStateContainer(t1);

  const makeDirty$ =  cold('----(b|)', { b: t2 }).pipe(tap(t => objectStateContainer.update(t)));
  const undoChange$ = cold('----------(c|)', { c: t1 }).pipe(tap(() => objectStateContainer.undoChanges()));
  const expected = '        a---b-----c';
  const stateValues = { a: false, b: true, c: false };

  const events$ = merge(makeDirty$, undoChange$);
  const expectedEvents = '  ----b-----(c|)';

  expectObservable(events$).toBe(expectedEvents, { b: t2, c: t1 });
  expectObservable(objectStateContainer.isDirty$).toBe(expected, stateValues);
});
/*
What expectObservable does is to subscribe to the given observable and turn each value/error/complete event into a notification, each notification being paired with the time frame at which it had arrived(Source code).

These notifications(value/error/complete) are the results of an action's task. An action is scheduled into a queue. The order in which they are queued is indicated by the virtual time.

For example, cold('----(b|)') means: at frame 4 send the value b and a complete notification. If you'd like to read more about how these actions and how they are queued, you can check out this SO answer.

In our case, we're expecting: a---b-----c, which means:

frame 0: a(false)
frame 4: b(true)
frame 10: c(false)
Where are these frame numbers coming from?

everything starts at frame 0 and that at moment the class is barely initialized
*/
cold('----(b|)) - will emit t2 at frame 4
cold('----------(c|)') - will call objectStateContainer.undoChanges() at frame 10
