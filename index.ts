import {allBooks, allReaders} from './data';
import {Observable, of, from, concat, fromEvent, Subscription} from 'rxjs';
import {map, mergeMap, take, takeUntil, filter, tap, catchError} from 'rxjs/operators';
import {ajax} from 'rxjs/ajax';
import {Pomodoro} from './pomodoro';

//#region CreatingObservables
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
// source3$.subscribe(data => console.log(data));


let button = document.getElementById('readersButton');

// fromEvent(button, 'click')
//     .subscribe(event => {
//         console.log(event);

//         let readers = allReaders;

//         const readerEl = document.getElementById('readers-list');
//         readers.forEach(r => {
//             readerEl.innerHTML += `${r.name} <br>`;
//         })
//     });

fromEvent(button, 'click')
    .subscribe(event => {
        ajax('/api/readers')
            .subscribe(
                response => {
                    console.log(response);
                    if (response.response) {
                        const data = response.response as {readerID: string, name: string, weeklyReadingGoals: number, totalMinutesRead: number}[];

                        const readerEl = document.getElementById('readers-list');
                        data.forEach(r => {
                            readerEl.innerHTML += `${r.name} <br>`;
                        })
                    }
                }
            )
    });
//#endregion

//#region Subscring to Observable

///////////////////// Subscribing to Observables
let books$ = from(allBooks);

// books$.subscribe(
//     book => console.log(`Title:  ${book.title}`),
//     err => console.log(`ERROR: ${err}`),
//     () => console.log('Complete')
// );

let currentTime$ = new Observable(subscriber => {
    const time = new Date().toLocaleTimeString();
    subscriber.next(time);
    subscriber.complete();
})

currentTime$.subscribe(
    time => console.log(`Time: (-1) ${time}`),
    null,
    () => console.log('---------------')
);
// Each observer triggers execution of the subscription
setTimeout(() => {
    currentTime$.subscribe(
        time => console.log(`Time: (1) ${time}`),
        null,
        () => console.log('---------------')
    );
}, 2000);

currentTime$.subscribe(
    time => console.log(`Time: (2) ${time}`),
    null,
    () => console.log('---------------')
);


const startTimerEl = document.getElementById('timerStartButton');
const stopTimerEl = document.getElementById('timerStopButton');

let stopWatch$: Subscription;

function timer(subscriber) {
    let second = 0;
    const intervalId = setInterval(() => {
        second++;
        subscriber.next(second);
    }, 1000);

    return () => {
        alert('Tear down');
        clearInterval(intervalId);
    }
}


fromEvent(startTimerEl, 'click').subscribe(
    v => {
        stopWatch$ = Observable.create(timer).subscribe(
            time => console.log(time),
            null,
            // when unsubscribing complete doesnt get called
            () => alert(`Timer stoppped`)
        );
    }
);

fromEvent(stopTimerEl, 'click').subscribe(
    v => {
        stopWatch$.unsubscribe();
    }
);

//#endregion


//#region 

///////////////////// RxJS Operators

let oneToFive$ = of(1, 2, 3, 4, 5);

oneToFive$.pipe(
    // 1 = 00001, 2 = 00010, 3 = 00011, 4 = 00100 (Binary)
    // 00001 << 2 = 001{00} (4) [Add 2 zeros at start]
    // 00011 << 2 = 011{00} (12) [Add 2 zeros at start]
    map(n => (n << 2))
).subscribe(
    n => console.log(n)
)

ajax('/api/books')
    .pipe(
        mergeMap(ajaxResponse => ajaxResponse.response),
        filter(book => book.publicationYear < 1950),
        tap(oldBook => console.log(`Title: ${oldBook.title}`))
        catchError(
            err => of({title: 'Failure'})
        )
    )
    .subscribe(
        response => console.log(response),
        err => console.log(`ERROR: ${err}`)
    )


let timer2$ = new Observable<number>(subscriber => {
    let secondsPassed = 0;

    setInterval(() => {
        secondsPassed++;
        subscriber.next(secondsPassed);
    }, 1000);
})

timer2$
    .pipe(
        take((60 * 0.1)) //run for 6 seconds and call complete
    )
    .subscribe(
        number => console.log(number),
        null,
        () => console.log('Completed')
    )

const stopTimerEl2 = document.getElementById('timerStopButton');
const stopTimer = fromEvent(stopTimerEl2, 'click');

// timer2$
//     .pipe(
//         takeUntil(stopTimer) //run for 6 seconds and call complete
//     )
//     .subscribe(
//         number => console.log(`takeUntil: ${number}`),
//         null,
//         () => console.log('Completed')
//     )

new Pomodoro();
//#endregion