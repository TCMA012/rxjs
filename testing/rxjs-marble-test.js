/*
https://stackoverflow.com/questions/65674297/rxjs-marble-test
https://rxjs.dev/guide/testing/marble-testing
And this test is failing. Here is why: you're expecting your test to emit at frames 2, 4, 5, 6, 7, 9 and a complete at frame 11. 
But, the actual emissions happen at frames 2, 4, 6, 6, 8, 10 and a complete at frame 12. 
*/
import { mergeMap, map } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';

describe('mergeMap', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler(someMatcher);
  });

  it('should maps to inner observable and flattens', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      // test is failing :(	
      const values = { a: 'hello', b: 'world', x: 'hello world' };
      const obs1 = cold('-a---a|     ', values);
      const obs2 = cold('-b-b-b-|    ', values);
      const expected = ' --x-xxxx-x-|';

      const result = obs1.pipe(mergeMap(x => obs2.pipe(map(y => x + ' ' + y))));
      expectObservable(result).toBe(expected, values);
    });
  });
});
/*
Now, to be able to visually understand why and how this is happening, 
I will write a test with couple of comments and I will align them a different way so you get a better filling of what happens:
*/
const obs1 = cold('-a---a|      ', values);
const obs2 = cold(' -b-b-b-|    ', values);
//                      -b-b-b-|
const expected = ' --x-xxxx-x-| ';
// frames:         0123456789012

/*
Basically, in mergeMap, you're returning an instance of obs2 when the source observable emits. In this case, the source is obs1. When it emits the first value (a), at frame 1, mergeMap internally subscribes to obs2 - this is why I aligned the start of obs2 emissions to be below a at frame 1. Emissions from obs2 are the ones that get to the consumer.

Similarly, when obs1 emits the second value, at frame 5, another subscribe to obs2 happens and, since obs2 is a cold observable, another producer is instantiated, so another stream starts to flow. This is why I added a comment to indicate when the second subscribe to obs2 happens. It starts at frame 5, right when the second a is emitted from obs1. Similarly, emissions from the second subscribe to obs2 are the ones that get to the consumer.

So, combining this, we get to conclusion where the expected frames should be:

 -b-b-b-|      emits at frames: 2, 4 and 6 and a complete at frame 8
     -b-b-b-|  emits at frames: 6, 8 and 10 and a complete at frame 12
0123456789012
Based on this, the final emissions happen at frames 2, 4, 6, 6, 8 and 10 and the complete happens at frame 12. The problem with this setup is that it is not possible to show an emission which comes early after two or more emissions that come at the same frame.

This is to say, emission at frame 8 is too close to the two emissions at frame 6. The reason being is that emissions that happen at the same frame are grouped with brackets () in marble diagrams and brackets are somewhat hiding some number of emissions. This is your case:

 -b-b-b-|    
     -b-b-b-|
--x-x-(xx)x-| // brackets start at frame 6 and represent grouped emissions which all happen at frame 6
0123456666012 // the frames 7, 8 and 9 are "hidden"
Frames 7, 8 and 9 are hidden and can't be represented so emissions at these frames can't be shown in marble diagrams, no matter what. And, since there is an emission at frame 8 which gets lost, you can't create a proper marble diagram for this expected emissions.

In order for this test to pass, you could emit the second a from the obs1 one frame further, at frame 6. Now, your test could look like this (and it should pass now):
*/
testScheduler.run(({ cold, expectObservable }) => {
  const values = { a: 'hello', b: 'world', x: 'hello world' };
  const obs1 = cold('-a----a|      ', values);
  const obs2 = cold(' -b-b-b-|     ', values);
  //                       -b-b-b-|
  const expected = ' --x-x-xx-x-x-|';

  const result = obs1.pipe(mergeMap(x => obs2.pipe(map(y => x + ' ' + y))));
  expectObservable(result).toBe(expected, values);
});