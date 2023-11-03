/*
https://stackoverflow.com/questions/36986548/when-to-use-asobservable-in-rxjs/36989035#36989035

When to use Subject.prototype.asObservable()
The purpose of this is to prevent leaking the "observer side" of the Subject out of an API. Basically to prevent a leaky abstraction when you don't want people to be able to "next" into the resulting observable.

NOTE: This really isn't how you should make a data source like this into an Observable, instead you should use the new Observable constructor, See below.
*/
const myAPI = {
  getData: () => {
    const subject = new Subject();
    const source = new SomeWeirdDataSource();
    source.onMessage = (data) => subject.next({ type: 'message', data });
    source.onOtherMessage = (data) => subject.next({ type: 'othermessage', data });
    return subject.asObservable();
  }
};
//when someone gets the observable result from myAPI.getData() they can't next values in to the result:
const result = myAPI.getData();
result.next('LOL hax!'); // throws an error because `next` doesn't exist
/*
You should usually be using new Observable(), though
In the example above, we're probably creating something we didn't mean to. For one, getData() isn't lazy like most observables, it's going to create the underlying data source SomeWeirdDataSource (and presumably some side effects) immediately. This also means if you retry or repeat the resulting observable, it's not going to work like you think it will.

It's better to encapsulate the creation of your data source within your observable like so:
*/
const myAPI = {
  getData: () => return new Observable(subscriber => {
    const source = new SomeWeirdDataSource();
    source.onMessage = (data) => subscriber.next({ type: 'message', data });
    source.onOtherMessage = (data) => subscriber.next({ type: 'othermessage', data });
    return () => {
      // Even better, now we can tear down the data source for cancellation!
      source.destroy();
    };
  });
}
/*
With the code above, any behavior, including making it "not lazy" can be composed on top of the observable using RxJS's existing operators.
*/