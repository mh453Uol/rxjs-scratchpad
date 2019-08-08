import {Observable} from "rxjs";

class Duration {
    startTime: Date;
    endTime: Date;
    durationInSeconds: number;
}
export class StopWatch {
    private stopTimer = false;
    private totalDurationInSeconds = -1;
    private timeInSeconds = -1;
    public duration: Duration;

    constructor(durationInSecond?: number) {
        this.duration = new Duration();
        this.totalDurationInSeconds = durationInSecond;
    }

    public timer$ = new Observable<number>(subscriber => {
        this.timeInSeconds = 0;
        const interval = setInterval(() => {
            this.timeInSeconds++;
            subscriber.next(this.timeInSeconds);

            if (this.timeInSeconds >= this.totalDurationInSeconds) {
                this.stop();
                subscriber.complete();
            }

            if(this.stopTimer) {
                subscriber.complete();
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    })

    start(): Observable<number> {
        this.duration.startTime = new Date();
        return this.timer$;
    }

    stop(): Duration {
        this.duration.endTime = new Date();
        this.duration.durationInSeconds = this.timeInSeconds;
        this.stopTimer = true;
        return this.duration;
    }
}