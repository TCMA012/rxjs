/*
https://stackblitz.com/edit/rxjs-vkrjrl?devtoolsheight=60&file=index.ts
RxJS Playground
Tips:
Try using interval or timer to create async streams of values to play with

Use fromEvent to create a stream of user events. fromEvent(document, 'click') is useful

See what's happening between operators by adding a tap(console.log). 
e.g.: 
source.pipe(map(fn), 
tap(console.log), 
filter(fn2))

Recipes:
Below are a few recipes to try out to play with RxJS
*/
import { of, map } from 'rxjs';

of('World')
  .pipe(map((name) => `Hello, ${name}!`))
  .subscribe(console.log);

// Open the console in the bottom right to see results.

//Basic Clock

import { map, timer } from 'rxjs';

const output = document.createElement('output');
document.body.prepend(output);

timer(0, 1000)
  .pipe(map(() => new Date().toLocaleTimeString()))
  .subscribe((time) => (output.textContent = time));
        
        
//Movable Element

import { fromEvent, exhaustMap, takeUntil } from 'rxjs';

const target = document.createElement('div');
target.setAttribute(
  'style',
  `
  position: absolute;
  top: 0;
  left: 0;
  background-color: red;
  width: 50px;
  height: 50px;
  `
);
document.body.append(target);

fromEvent(target, 'mousedown')
  .pipe(
    exhaustMap(() =>
      fromEvent(document, 'mousemove').pipe(
        takeUntil(fromEvent(document, 'mouseup'))
      )
    )
  )
  .subscribe(({ pageX, pageY }: MouseEvent) => {
    target.style.transform = `translate3d(${pageX}px, ${pageY}px, 0)`;
  });
        
   
//Animated Dot Trail

import { fromEvent, animationFrames, mergeMap, tap, takeWhile } from 'rxjs';

const dotTemplate = document.createElement('div');
dotTemplate.setAttribute(
  'style',
  `
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
    background-color: lime;
    border-radius: 50%;
  `
);

// When the mouse moves, add animated dots to the screen.
fromEvent(document, 'mousemove')
  .pipe(mergeMap((e: MouseEvent) => addDot(e.pageX, e.pageY)))
  .subscribe();

function addDot(x: number, y: number) {
  // Pick a random velocity
  const xVelocity = Math.random() * 2 - 1;
  const yVelocity = Math.random() * 2 - 1;

  let dot: HTMLDivElement;

  return animationFrames().pipe(
    // Only take animation frames for 1 second.
    takeWhile(({ elapsed }) => elapsed < 1000),

    // Set the position on the dot as a side-effect.
    tap({
      subscribe: () => {
        // When subscribed to, create and add the dot element when
        // the observable is subscribed to
        dot = dotTemplate.cloneNode() as HTMLDivElement;
        document.body.append(dot);
      },
      next: () => {
        // Move our x and y by the predefined velocity
        x += xVelocity;
        y += yVelocity;
        // Update the position of the dot for each value in our animation loop
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      },
      finalize: () => {
        // When the animation is over, or when the consumer unsubscribes
        // remove the dot.
        dot.remove();
      },
    })
  );
}
