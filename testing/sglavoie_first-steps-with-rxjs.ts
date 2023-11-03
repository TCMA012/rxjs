/*
sglavoie_first-steps-with-rxjs
https://www.sglavoie.com/posts/2023/10/01/first-steps-with-rxjs/
*/
import { delay, from } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});

describe('testing async behavior', () => {
  it('should test asynchronous operations', () => {
    testScheduler.run((helpers) => {
      const { expectObservable } = helpers;
      const source$ = from([1, 2, 3]);
      const final$ = source$.pipe(delay(1000));
      const expected = '1s (abc|)';
      expectObservable(final$).toBe(expected, { a: 1, b: 2, c: 3 });
    });
  });
});