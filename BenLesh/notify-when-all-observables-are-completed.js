/*
https://stackoverflow.com/questions/45425813/notify-when-all-observables-are-completed/45427596#45427596
If you want to run all of these observables concurrently, concatMap will not do what you want. You can do these two things with the do and forkJoin operators.

forkJoin is basically Promise.all for observables.

do is a way to tap into the values being passed through and observable so you can "do" something with them (a side-effect).
*/
const arrayOfObservables = [observable1, observable2, observable3];

Observable.forkJoin(
  arrayOfObservables.map((obs, i) => obs.do({
    next(value) { console.log(`Observable ${i} emits: ${value}`); },
    complete() { console.log(`Observable ${i} is complete`); }
  }))
)
.subscribe(values => console.log('everything done with', values))