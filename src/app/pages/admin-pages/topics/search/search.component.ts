import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

@Component({
    selector: 'app-search-input',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchInputComponent implements OnInit {

    search = new FormControl('');

    @Output()
    valueChanged = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit(): void {
        this.search.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
            this.valueChanged.emit(value);
        });
    }

}
