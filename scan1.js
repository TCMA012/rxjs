//https://www.learnrxjs.io/learn-rxjs/operators/transformation/scan
//Example 1: Sum over time
import { of } from 'rxjs';
import { scan } from 'rxjs/operators';
​
const source = of(1, 3, 9);
// basic scan example, sum over time starting with zero
const example = source.pipe(scan((acc, curr) => acc + curr, 0));
// log accumulated values
// output: 1,4,13
const subscribe = example.subscribe(val => console.log(val));