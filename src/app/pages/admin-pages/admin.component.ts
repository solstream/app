import {Component, OnInit} from '@angular/core';
import {PtvUserService} from '../../_core/services/ptv-user.service';
import {LocalStorageService} from '../../_core/services/auth-store.service';
import {Router} from '@angular/router';
import {ChannelsService} from '../../_core/services/channels.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {AccountModel} from '../../_core/model/accountModel';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    constructor() {
    }
    ngOnInit(): void {
    }
}

export interface User {
    id: number;
    // name: string;
    username: string;
    role: string;
    lastAction: Date | 'not-set';
    createDate: Date | 'not-set';
}
