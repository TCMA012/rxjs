//https://stackoverflow.com/questions/70010844/still-dont-understand-how-rxjs-operator-combinelatestall-works
import { combineLatestAll, of, map } from 'rxjs';

const s1 = of(1, 2, 3).pipe(
  map(v1 =>
    of(100, 101, 102, 103, 104).pipe(
      map(v2 => [v1,v2])
    )
  ),
  combineLatestAll()
);

s1.subscribe(console.log);
/*
[ [ 1, 104 ], [ 2, 104 ], [ 3, 100 ] ]
[ [ 1, 104 ], [ 2, 104 ], [ 3, 101 ] ]
[ [ 1, 104 ], [ 2, 104 ], [ 3, 102 ] ]
[ [ 1, 104 ], [ 2, 104 ], [ 3, 103 ] ]
[ [ 1, 104 ], [ 2, 104 ], [ 3, 104 ] ]
*/
/*
Before you understand combineLatestAll, let's analyze the behavior of combineLatest.
As per the marble diagram shown here, if we have 2 streams of data, then combineLatest "combines" the latest values from the 2 streams.
ie. of the 2 streams it has subscribed to, unless both of them start emitting data, you will not see any output.
However, what would happen, if first stream is already completed by the time the second one starts.
*/
var c1 = of(5, 15, 25);
var c2 = of(6, 16, 26);

var s2 = combineLatest([c1,c2]);
s2.subscribe(console.log) // [25,6] [25,16] and [25, 26]
/*
In such case, combineLatest operator will the take the latest/last value from source1 (25 in the above example) and then start emitting output when the second stream starts (combining the latest/last value from source1 and all incoming values from source2)
There were 3 sources in this case, combineLatest will produce an output only when all 3 streams have started generating output.
*/
var c1 = of(5, 15, 25);
var c2 = of(6, 16, 26);
var c3 = of(7, 17, 27);

var s2 = combineLatest([c1,c2, c3]);
s2.subscribe(console.log) // [25,26, 7] [25,26, 17] and [25, 26, 27]
/*
In the above case, by the time third observable starts emitting the value, the other 2 observables have already completed. Hence the output resembles taking the latest/last value from the first 2 sources and then combining it with the all the values from third observable.
The above example can also be written as
*/
var s3 = of(c1, c2, c3).pipe(combineLatestAll());
s3.subscribe(console.log);

//First 2 observables have the latest value and then it gets combined with each value from last observable.