import {StopWatch} from "./stopwatch";
import {concat} from "rxjs/operators";

export class Pomodoro {
    lifeCycle = [new StopWatch(5), new StopWatch(6)];
    currentPomodoroIndex = 0;

    constructor() {
        this.nextPomodoro(this.currentPomodoroIndex);
    }

    inMinutes(miliseconds: number) {
        return miliseconds * 1000 * 60;
    }

    nextPomodoro(pomodoroIndex: number) {
        if (pomodoroIndex > this.lifeCycle.length - 1) {
            return;
        }

        concat(this.lifeCycle[0].start(),this.lifeCycle[1].start());



    }

    after1Second(callback) {
        setTimeout(callback, 2000);
    }

}