//https://rxjs.dev/api/index/function/scan
import { of, scan, map } from 'rxjs';

const numbers$ = of(1, 3, 9);

numbers$
  .pipe(
    // Get the sum of the numbers coming in.
    scan((total, n) => total + n),
    // Get the average by dividing the sum by the total number
    // received so far (which is 1 more than the zero-based index).
    map((sum, index) => sum / (index + 1))
  )
  .subscribe(console.log);
/*
1
2
4.333333333333333
*/