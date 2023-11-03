/*
https://stackoverflow.com/questions/41150533/how-to-observable-interval-multiple-http-requests-forkjoin-in-rxjs/41152978#41152978
composing forkJoin on top of the interval
*/
// interval every 10 seconds
Observable.interval(1000)
  // we probably only need one set of AJAX calls running at a time,
  // so use switchMap here.
  .switchMap(() =>
    // wait for both of these to complete before emitting
    Observable.forkJoin(
      // get posts
      this.searchService.getPosts()
        // if that GET fails handle it somehow (returning an observable)
        .catch(handlePostsErrors),
      // get comment in parallel to posts
      this.searchService.getPostComment(1)
        // if that GET fails, handle it like above
        .catch(handlePostCommentErrors)
    )
  )
  // posts and comment will come through in an array because of forkJoin
  .subscribe(([posts, comment]) => doSomething(posts, comment))