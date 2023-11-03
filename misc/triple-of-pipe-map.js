/*
https://stackoverflow.com/questions/71506549/how-to-convert-rxjs-triple-of-pipe-map-expression-to-the-observable
use toArray() operator
https://stackblitz.com/edit/rxjs-veofem?devtoolsheight=60
*/
var r2 = of(5, 15, 25).pipe(
  map(v1=>of(6, 16, 26).pipe(
    map(v2=>of(7, 17, 27).pipe(
      map(v3 => [v1,v2,v3]),
      toArray(),
  )))),
  combineLatestAll());
/*
or avoid the nested Observable you'll need mergeMap:
https://stackblitz.com/edit/rxjs-riquzh?devtoolsheight=60
*/

var r2 = of(5, 15, 25).pipe(
  map(v1=>of(6, 16, 26).pipe(
    mergeMap(v2=>of(7, 17, 27).pipe(
      map(v3 => [v1,v2,v3]),
      toArray(),
      )))),
  combineLatestAll());

r2.subscribe(e1 => {
  e1.forEach(e2 => {
    console.log(e2);
  })
});