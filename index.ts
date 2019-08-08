import { allBooks, allReaders } from './data';
import { Observable, of, from, concat, fromEvent } from 'rxjs';

///////////////////// Creating Observables 

// What will happen when the observable
// is subscribed.
function subscribe(subscriber) {
    if (document.title !== 'RxBookTracker') {
        // if observer returns error or complete
        // no more values can be sent.
        subscriber.error('Incorrect page title');
    }

    for (let book of allBooks) {
        subscriber.next(book);
    }

    // after 2 secs execute complete
    setTimeout(() => {
        subscriber.complete();
    }, 2000);

    // which will execute clean up
    // resource method
    return () => console.log('Executing teardown code.');

}

// let allBooksObservable$ =
//     new Observable(subscribe);

/* 
let allBooksObservable$ = 
    Observable.create(subscribe);

allBooksObservable$.subscribe(
    books => { console.log(books); }
);
*/

///////////////////// Creating observables operators

let source1$ = of(1, 'hello', true, allReaders[0]);

// source1$.subscribe(
//     value => { console.log(value); }
// );

let source2$ = from(allBooks);

// source2$.subscribe(
//     data => console.log(data)
// );

let source3$ = concat(source1$, source2$);
source3$.subscribe(data => console.log(data));





