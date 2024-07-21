import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {CommentsAPIModel, CommentsComponentState, CommentsComponentModel} from './comments-component-state.service';
import {CurrentUserState} from '../../../../../_core/services/current-user-state.service';
import {ColorsService} from '../../../../../_core/services/colors.service';
import {map} from 'rxjs/operators';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

    @Input()
    showTitle = true;
    @Output()
    closeClicked = new EventEmitter();
    @Input()
    userName = '';
    @Output()
    hideChatWindow = new EventEmitter();

    disabled = false;
    toggled = false;

    comments: CommentsComponentModel[] = [];
    comment = '';

    isMobile = false;
    showEmojies = false;

    private usersColors = {};


    @ViewChild('scrollToBottom') private myScrollContainer: ElementRef;

    constructor(private device: DeviceDetectorService,
                private colors: ColorsService,
                private commentsState: CommentsComponentState,
                private cus: CurrentUserState) {
        this.isMobile = device.isMobile();
    }

    ngOnInit(): void {
        this.commentsState.comments$
            .pipe(map(resp => this.applyMessageColors(resp)))
            .subscribe((rez: CommentsComponentModel[]) => {
                this.comments = rez;
                if (this.comments.length === 0) { this.toggleChatWindow(); }
            });

        // mojies block the initial rendering and slows down app initial load, timeout fixes it
        setTimeout(() => {
            this.showEmojies = true;
        }, 3000);

    }

    private applyMessageColors(apiModel: CommentsAPIModel[]): CommentsComponentModel[] {
        const compModel = apiModel as CommentsComponentModel[];
        compModel.forEach((message: CommentsComponentModel) => {
            if (this.usersColors[message.userName]) {
                message.color = this.usersColors[message.userName];
            } else {
                const color = this.colors.getRandomColor();
                this.usersColors[message.userName] = color;
                message.color = color;
            }
        });
        return compModel;
    }

    isLoggedIn(): boolean {
        return this.cus.isLoggedIn();
    }

    isRoomOwner(): boolean {
        return this.commentsState.currentVideo$.value.roomName === this.cus.getCurrentUserRoom()?.roomName;
    }

    isCommentOwner(commentUserName: string): boolean {
        return this.cus.getCurrentUserRoom()?.roomName === commentUserName;
    }

    canSendMessage(commentText: string): boolean {
        return !this.disabled && this.cus.isLoggedIn() && commentText.length > 0;
    }

    postComment(commentText: string): void {
        if (this.canSendMessage(commentText) && commentText.length > 0) {
            this.disabled = true;
            this.comment = '';
            this.commentsState.postComment(commentText).subscribe((response) => {
                const comment = response as CommentsComponentModel;
                comment.color = this.usersColors[comment.userName];
                this.comments.push(comment);
                this.disabled = false;
            });
        }
    }

    handleSelection(event): void {
        this.comment = this.comment + ' ' + event.char;
        this.toggled = false;
    }

    deleteComment(comment: CommentsComponentModel, index: number): void {
        this.comments.splice(index, 1);
        this.commentsState.deleteComment(comment.id).subscribe();
    }

    toggleChatWindow(): void {
        this.hideChatWindow.emit(true);
    }

}
