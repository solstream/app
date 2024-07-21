import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {timer} from 'rxjs';
import {StreamerContextState} from '../../stream-context-state.service';

@Component({
    selector: 'app-live-counter',
    templateUrl: './live-counter.component.html',
    styleUrls: ['./live-counter.component.scss']
})
export class LiveCounterComponent implements OnInit, OnDestroy {

    time = 0;
    displayTime = '0:00';

    @Input()
    maxTimeSeconds = 6000;

    @Output()
    limitReached = new EventEmitter();

    timerSubscr;

    constructor(public scx: StreamerContextState) {
    }

    ngOnInit(): void {
        this.observableTimer();
    }


    observableTimer(): void {
        const source = timer(1000, 1000);
        this.timerSubscr = source.subscribe(val => {
            this.time = val;
            this.setDisplayTime();
            if (this.time >= this.maxTimeSeconds) {
                this.limitReached.emit();
            }
        });
    }

    setDisplayTime(): void {
        const minuteValue = Math.floor(this.time / 60);
        let secondsValue = (this.time % 60).toString();
        if (secondsValue.length === 1) {
            secondsValue = '0' + secondsValue;
        }
        this.displayTime = minuteValue + ':' + secondsValue;
    }

    ngOnDestroy(): void {
        if (this.timerSubscr) {
            this.timerSubscr.unsubscribe();
        }
    }

}
