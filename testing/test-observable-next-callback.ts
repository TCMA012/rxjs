/*
https://stackoverflow.com/questions/53770717/test-observable-next-callback-in-rxjs-and-angular

I put together a simple Stackblitz to show you how I would approach testing that simple component method you describe.

Here is the spec from that Stackblitz:
*/
it(`works with "of" 'cuz I want it to`, () => {
    spyOn(someService, 'methodReturningObservable').and.returnValue(of(10));
    component.somethingOrOther();
    expect(component.testMe).toBe(10);
});
/*
Some of the changes I made to your code:

I had to make minor changes to your component method to have it work. Details in the Stackblitz.
The cold() function is from the marble testing library, but that is way overkill for such a simple function. rxjs has the of Observable creation method available which can create a cold synchronous observable that can be subscribed to (but more below if you really want to test it this way).
Since the spec above uses a synchronous observable, there is no need for fakeAsync(), as it will complete immediately.
The method under test needed to be called explicitly to be tested, done above with the line component.somethingOrOther().
As you can see in the Stackblitz, this test passes just fine.

Now, if you want to use marble testing even for this simple case, I set up another spec in the Stackblitz for that. It is as follows:
*/
it(`works with "cold" 'cuz I want it to`, () => {
    spyOn(someService, 'methodReturningObservable').and.returnValue(cold('a', { a: 10 }));
    component.somethingOrOther();
    getTestScheduler().flush(); // flush the observables
    expect(component.testMe).toBe(10);
});
/*
Note the fact that the component function needed to be called
The flushing of the getTestScheduler needs to be done as well.
Both tests are now passing in the Stackblitz.

Official docs for marble testing in Angular are here.
*/