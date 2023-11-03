/*
https://rxjs.dev/guide/testing/marble-testing
time() - converts marbles into a number indicating number of frames. It can be used by operators expecting a specific timeout. It measures time based on the position of the complete (|) signal
*/
import { TestScheduler } from 'rxjs/testing';
import { throttleTime } from 'rxjs';

const testScheduler = new TestScheduler((actual, expected) => {
  // asserting the two objects are equal - required
  // for TestScheduler assertions to work via your test framework
  // e.g. using chai.
  expect(actual).deep.equal(expected);
});

// This test runs synchronously.
it('generates the stream correctly', () => {
  testScheduler.run((helpers) => {
    const { cold, time, expectObservable, expectSubscriptions } = helpers;
    const e1 =  cold(' -a--b--c---|');
    const e1subs =   '  ^----------!';
    const t =   time('   ---|       '); // t = 3
    const expected =  '-a-----c---|';

    expectObservable(e1.pipe(throttleTime(t))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);
  });
});



{
testScheduler.run((helpers) => {
  const { cold, hot, expectObservable, expectSubscriptions, flush, time, animate } = helpers;
  // use them
});
}



testScheduler.run((helpers) => {
  const { time, cold } = helpers;
  const source = cold('---a--b--|');
  const t =      time('        --|    ');
  //                           --|
  const expected =    '   -----a--b|';
  const result = source.pipe(delay(t));
  expectObservable(result).toBe(expected);
});



testScheduler.run((helpers) => {
  const { animate, cold } = helpers;
                animate('              ---x---x---x---x');
  const requests = cold('-r-------r------');
  /* ... */
  const expected =      '     ---a-------b----';
});



/*
Marble syntax
In the context of TestScheduler, a marble diagram is a string containing special syntax representing events happening over virtual time. Time progresses by frames. The first character of any marble string always represents the zero frame, or the start of time. Inside of testScheduler.run(callback) the frameTimeFactor is set to 1, which means one frame is equal to one virtual millisecond.

How many virtual milliseconds one frame represents depends on the value of TestScheduler.frameTimeFactor. For legacy reasons the value of frameTimeFactor is 1 only when your code inside the testScheduler.run(callback) callback is running. Outside of it, it's set to 10. This will likely change in a future version of RxJS so that it is always 1.

IMPORTANT: This syntax guide refers to usage of marble diagrams when using the new testScheduler.run(callback). The semantics of marble diagrams when using the TestScheduler manually are different, and some features like the new time progression syntax are not supported.

' ' whitespace: horizontal whitespace is ignored, and can be used to help vertically align multiple marble diagrams.
'-' frame: 1 "frame" of virtual time passing (see above description of frames).
[0-9]+[ms|s|m] time progression: the time progression syntax lets you progress virtual time by a specific amount. It's a number, followed by a time unit of ms (milliseconds), s (seconds), or m (minutes) without any space between them, e.g. a 10ms b. See Time progression syntax for more details.
'|' complete: The successful completion of an observable. This is the observable producer signaling complete().
'#' error: An error terminating the observable. This is the observable producer signaling error().
[a-z0-9] e.g. 'a' any alphanumeric character: Represents a value being emitted by the producer signaling next(). Also consider that you could map this into an object or an array like this:
*/
const expected = '400ms (a-b|)';
const values = {
  a: 'value emitted',
  b: 'another value emitted',
};

expectObservable(someStreamForTesting).toBe(expected, values);


// This would work also
const expected = '400ms (0-1|)';
const values = [
  'value emitted',
  'another value emitted'
];

expectObservable(someStreamForTesting).toBe(expected, values);



/*
'()' sync groupings: When multiple events need to be in the same frame synchronously, parentheses are used to group those events. You can group next'd values, a completion, or an error in this manner. The position of the initial ( determines the time at which its values are emitted. While it can be counter-intuitive at first, after all the values have synchronously emitted time will progress a number of frames equal to the number of ASCII characters in the group, including the parentheses. e.g. '(abc)' will emit the values of a, b, and c synchronously in the same frame and then advance virtual time by 5 frames, '(abc)'.length === 5. This is done because it often helps you vertically align your marble diagrams, but it's a known pain point in real-world testing. 



Time progression syntax
The new time progression syntax takes inspiration from the CSS duration syntax. It's a number (integer or floating point) immediately followed by a unit; ms (milliseconds), s (seconds), m (minutes). e.g. 100ms, 1.4s, 5.25m.

When it's not the first character of the diagram it must be padded a space before/after to disambiguate it from a series of marbles. e.g. a 1ms b needs the spaces because a1msb will be interpreted as ['a', '1', 'm', 's', 'b'] where each of these characters is a value that will be next()'d as-is.

NOTE: You may have to subtract 1 millisecond from the time you want to progress because the alphanumeric marbles (representing an actual emitted value) advance time 1 virtual frame themselves already, after they emit. This can be counter-intuitive and frustrating, but for now it is indeed correct.
*/
const input       = ' -a-b-c|';
const expected    = '-- 9ms a 9ms b 9ms (c|)';

// Depending on your personal preferences you could also
// use frame dashes to keep vertical alignment with the input.
// const input = ' -a-b-c|';
// const expected = '------- 4ms a 9ms b 9ms (c|)';
// or
// const expected = '-----------a 9ms b 9ms (c|)';

const result = cold(input).pipe(
  concatMap((d) => of(d).pipe(
    delay(10)
  ))
);

expectObservable(result).toBe(expected);



/*
Subscription marbles
'-' or '------': no subscription ever happened.
'--^--': a subscription happened after 2 "frames" of time passed, and the subscription was not unsubscribed.
'--^--!-': on frame 2 a subscription happened, and on frame 5 was unsubscribed.
'500ms ^ 1s !': on frame 500 a subscription happened, and on frame 1,501 was unsubscribed.
Given a hot source, test multiple subscribers that subscribe at different times:
*/
testScheduler.run(({ hot, expectObservable }) => {
  const source = hot('--a--a--a--a--a--a--a--');
  const sub1 = '      --^-----------!';
  const sub2 = '      ---------^--------!';
  const expect1 =    '   --a--a--a--a--';
  const expect2 =    '   -----------a--a--a-';

  expectObservable(source, sub1).toBe(expect1);
  expectObservable(source, sub2).toBe(expect2);
});



//Manually unsubscribe from a source that will never complete:
it('should repeat forever', () => {
  const testScheduler = createScheduler();

  testScheduler.run(({ expectObservable }) => {
    const foreverStream$ = interval(1).pipe(mapTo('a'));

    // Omitting this arg may crash the test suite.
    const unsub = '------!';

    expectObservable(foreverStream$, unsub).toBe('-aaaaa');
  });
});



/*
Synchronous Assertion
Sometimes, we need to assert changes in state after an observable stream has completed - such as when a side effect like tap updates a variable. Outside of Marbles testing with TestScheduler, we might think of this as creating a delay or waiting before making our assertion.
*/
let eventCount = 0;

const s1 = cold('--a--b|', { a: 'x', b: 'y' });

// side effect using 'tap' updates a variable
const result = s1.pipe(tap(() => eventCount++));

expectObservable(result).toBe('--a--b|', { a: 'x', b: 'y' });

// flush - run 'virtual time' to complete all outstanding hot or cold observables
flush();

expect(eventCount).toBe(2);



/*
Known issues
RxJS code that consumes Promises cannot be directly tested
If you have RxJS code that uses asynchronous scheduling - e.g. Promises, etc. - you can't reliably use marble diagrams for that particular code. This is because those other scheduling methods won't be virtualized or known to TestScheduler.
The solution is to test that code in isolation, with the traditional asynchronous testing methods of your testing framework. The specifics depend on your testing framework of choice, but here's a pseudo-code example:
*/
// Some RxJS code that also consumes a Promise, so TestScheduler won't be able
// to correctly virtualize and the test will always be really asynchronous.
const myAsyncCode = () => from(Promise.resolve('something'));

it('has async code', (done) => {
  myAsyncCode().subscribe((d) => {
    assertEqual(d, 'something');
    done();
  });
});