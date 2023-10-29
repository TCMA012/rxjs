//https://stackoverflow.com/questions/61760475/how-to-test-with-the-marble-approach-when-the-returm-is-a-empty-observable-in-ef
it('should return a empty observable', () => {
   this.moviesServiceSpy.and.return(throwError('Error in service'));

   action$ = hot('a', a: { loadMovies() });

   const expected = cold('');

   expect(loadMovies$).toBeObservable(expected);

})

//the following test passes too:
it('should match EMPTY with a single tick pipe marble', () => {
   expect(EMPTY).toBeObservable(cold('|'));
   expect(EMPTY).toBeObservable(hot('|'));

   // empty() is deprecated, but these assertions still pass.
   expect(empty()).toBeObservable(cold('|'));
   expect(empty()).toBeObservable(hot('|'));
});