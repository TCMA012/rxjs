/*
https://stackoverflow.com/questions/76406824/30-sec-timeout-angular-rxjs/76425044

Generally, you'd timeout using the timeout operator. A timeout situation is a exceptional / error case, so you'd handle it in the error path (or in a catchError somewhere)
*/
import { timeout, TimeoutError } from 'rxjs';

someSource$.pipe(
  timeout(30_000)
)
.subscribe({
  next: console.log,
  error: err => {
    if (err instanceof TimeoutError) {
       console.error('there was a timeout!');
       return;
    }
    console.error('some other error happened');
  }
})
/*
There are a lot of different settings on the RxJS timeout operator, you can have it 
timeout waiting for the first value, you can have it 
timeout with some other observable (or even a custom error if you use with: () => { throw new MyCustomError() })
*/