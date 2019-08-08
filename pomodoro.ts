import {StopWatch, Duration} from "./stopwatch";
import {Observable, of, from, concat, fromEvent, Subscription} from 'rxjs';

export class Pomodoro {
    durations: Duration[] = [];
    lifeCycle = [new StopWatch(5), new StopWatch(6)];

    constructor() {
        this.start();
    }

    inMinutes(miliseconds: number) {
        return miliseconds * 1000 * 60;
    }

    start() {

        let j = concat(this.lifeCycle[0].start(), this.lifeCycle[1].start());

        j.subscribe(
            a => console.log('*******' + a),
            null,
            () => {
                console.log(this.lifeCycle);
            }
        );
    }

}