import {Component, Input, OnInit} from '@angular/core';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import {FormControl, FormGroup} from '@angular/forms';
import {ChannelsService} from '../../../_core/services/channels.service';

@Component({
    selector: 'app-bio',
    templateUrl: './bio.component.html',
    styleUrls: ['./bio.component.scss']
})
export class BioComponent implements OnInit {

    iconEdit = faPen;
    editMode = false;

    @Input()
    canEdit = false;

    roomForm = new FormGroup({
        roomDescription: new FormControl(''),
    });

    @Input()
    roomName: string;

    @Input()
    set bioText(val: string) {
        this.updateFormValues(val);
    }

    constructor(private roomService: ChannelsService) {
    }

    ngOnInit(): void {
    }

    updateFormValues(val): void {
        this.roomForm.get('roomDescription').setValue(val);
    }

    getBioText(): string {
        return this.roomForm.get('roomDescription')?.value;
    }

    saveBioText(): void {
        const y = this.getBioText();
        this.roomService.updateBio(this.roomName, y).subscribe((room) => {
            this.bioText = room.bioText;
            this.editMode = false;
        });
    }

    // getText(val: string) {
    //     return val.replace('/n', '<br>');
    // }

}
