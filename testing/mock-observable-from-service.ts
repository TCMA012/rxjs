/*
https://stackoverflow.com/questions/70988602/how-to-mock-observable-from-service-in-marble-testing
When you create a new instance of MyService, the property logic$ gets assigned using the initial value of data$.

Even if you change the value of data$ afterwards, the logic$ property wont be re-evaluated, so it will keep having the same initial value (using the BehaviorSubject as source).

To test logic$ using marbles, do:
*/
it('should be toto lala', inject([MyService], (service: MyService) => {
  testScheduler.run((helpers) => {
    const { expectObservable, cold } = helpers;
    const sourceMarbles =   '-1-2';
    const expectedMarbles = 'ia-b';

    // create cold obs as source
    const source = cold(sourceMarbles, { 1: 'foo', 2: 'bar' });

    // subscribe BehaviourSubject to source to relay emitted values
    source.subscribe(service.data);
    

    // test the output of logic$
    expectObservable(service.logic$).toBe(expectedMarbles, {
      i: 'Mighty ', // <- this accounts for the initial value of the Behavior
      a: 'Mighty foo',
      b: 'Mighty bar',
    });
  });
}));