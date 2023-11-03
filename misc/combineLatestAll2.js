//https://stackoverflow.com/questions/71495469/the-output-from-combinelatestall-operator-seems-to-be-incorrect
var s2 = of(6, 16, 26).pipe(map(v1=>of(5, 15, 25).pipe(map(v2=>[v2,v1]))), combineLatestAll());
      s2.subscribe(console.log)
/*
[25, 6]
[25, 16]
[5, 26]

[25, 6]
[25, 16]
[15, 26]

[25, 6]
[25, 16]
[25, 26]

This is a timeline of what happens:
O1 [5,6] [15,6] [25,6]

O2                      [5,16] [15,16] [25,16]        

O3                                             [5,26]  [15,26] [25,26]

CLA                              latest O1 ->  [25,6]  [25,6]  [25,6]                                              
                                 latest O2 ->  [25,16] [25,16] [25,16]
                                 latest O3 ->  [5,26]  [15,26] [25,26]
combineLatestAll subscribes to all observables. 
When you subscribe to a stream such as of(5, 15, 25) it completes before anything else can happen. So observable 1 completes, observable 2 completes and the values emitted by observable 3 are each combined with the latest values from O1 and O2.
*/