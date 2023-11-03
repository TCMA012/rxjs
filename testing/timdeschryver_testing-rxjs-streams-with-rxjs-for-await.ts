//https://timdeschryver.dev/blog/testing-rxjs-streams-with-rxjs-for-await
import { TestScheduler } from 'rxjs/testing';

//test a simple map to map a value to its corresponding letter in the alphabet, over a certain amount of time
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const toAlphabet = (): OperatorFunction<any, string> => (source) =>
  source.pipe(map((v) => ALPHABET[v]));
//const source = timer(100, 10).pipe(toAlphabet(), takeWhile(Boolean));
 

test('TestScheduler', () => {
  const scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
 
  scheduler.run(({ expectObservable }) => {
    const source = timer(100, 10).pipe(toAlphabet(), takeWhile(Boolean));
    const expected =
      '100ms a 9ms b 9ms c 9ms d 9ms e 9ms f 9ms g 9ms h 9ms i 9ms j 9ms k 9ms l 9ms m 9ms n 9ms o 9ms p 9ms q 9ms r 9ms s 9ms t 9ms u 9ms v 9ms w 9ms x 9ms y 9ms z 9ms |';
    expectObservable(source).toBe(expected);
  });
});