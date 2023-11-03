/*
https://stackoverflow.com/questions/51603801/using-rxjs-ajax-i-get-cors-is-not-supported-by-your-browser/51751657#51751657
https://github.com/ReactiveX/rxjs/issues/3978#issuecomment-411472389
You would need to put your createXHR function on your actual configuration passed to the ajax() call:
*/
import { XMLHttpRequest } from 'xmlhttprequest'

function createXHR() {
  return new XMLHttpRequest();
}

const ajax$ = ajax({
  createXHR, // <--- here
  url: genURL_chan(179),
  crossDomain: true,
  withCredentials: false,
  method: 'POST',
  body: { 'since': 0, 'mode': 'Messages', 'msgCount': 5000},
});
