import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ChatService, MessageApiModel} from '../../../_core/services/chat.service';
import {interval} from 'rxjs';
import {MessageComponentState, RoomConference} from './channel-live-actions.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ColorsService} from '../../../_core/services/colors.service';
import {CurrentUserState} from '../../../_core/services/current-user-state.service';
import {CommentsComponentState} from '../../../pages/channel-pages/channels-page/_shared/video-comments/comments-component-state.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
    private fetchMessagesSubs = null;
    private enterRoomSubs = null;
    private getMessagesSubs = null;

    disabled = false;
    toggled = false;

    messages: MessageApiModel[];
    message = '';

    private usersColors: string[] = [];
    room: RoomConference = null;

    isMobile = false;
    userColorText = '';

    isRoomOwner = false;

    @Input() showControls = false;

    @Input()
    userName = '';

    @Output()
    closeClicked = new EventEmitter();

    @ViewChild('scrollToBottom') private myScrollContainer: ElementRef;

    constructor(public mob: DeviceDetectorService,
                private cu: CurrentUserState,
                private chatService: ChatService,
                private actions: MessageComponentState,
                private colors: ColorsService) {
        this.isMobile = mob.isMobile();
    }

    ngOnInit(): void {
        this.actions.currentLiveStream$.subscribe((room) => {
            this.isRoomOwner = room.roomName === this.cu.getCurrentUserRoom()?.roomName;
        });

        this.enterRoomSubs = this.actions.enterRoom().subscribe((room) => {
            this.loadMessages(room.roomName, room.confId);
            this.room = room;
        });
        this.fetchMessagesSubs = interval(5000).subscribe(() => {
            if (this.room !== null) {
                this.loadMessages(this.room.roomName, this.room.confId);
            }
        });
    }

    isLoggedIn(): boolean {
        return this.cu.isLoggedIn();
    }

    loadMessages(roomName: string, confId: string): void {
        this.getMessagesSubs = this.chatService.getMessages(roomName, confId).subscribe(messages => {
            messages.forEach((message: MessageApiModel, index) => {
                if (this.usersColors[message.userName]) {
                    messages[index].color = this.usersColors[message.userName];
                } else {
                    messages[index].color = this.getRandomColorAndSetForUser(message.userName);
                }
            });
            this.messages = messages;
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            setTimeout(() => {
                this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            }, 10);
        });

    }

    emojiSelected(event): void {
        this.message = this.message + ' ' + event.char;
        this.toggled = false;
    }

    broadcastMessage(message: string): void {
        if (this.disabled) {
            return;
        }
        this.message = '';
        this.disabled = true;
        const messageApi: MessageApiModel = {
            confId: this.room.confId,
            roomName: this.room.roomName,
            userName: this.userName,
            text: message
        };
        this.chatService.createMessage(messageApi).subscribe(() => {
            setTimeout(() => {
                this.disabled = false;
            }, 5500);
            this.loadMessages(this.room.roomName, this.room.confId);
        });

    }

    getRandomColorAndSetForUser(user: string): string {
        const color = this.colors.getRandomColor();
        this.usersColors[user] = color;
        return color;
    }

    deleteMessage(message: MessageApiModel): void {
        const idx = this.messages.findIndex(m => m.id === message.id);
        if (idx > -1) {
            this.messages.slice(idx);
            this.chatService.deleteMessageNew(message.id).subscribe();
        }
    }

    isHelperOrOwner(message: MessageApiModel): boolean {
        if (message.userName === this.cu.getCurrentUserRoom().roomName) {
            return true;
        }
        if (message.userName.indexOf('helper') > -1) {
            return true;
        }
        return false;

    }

    banUser(message: MessageApiModel): void {
        if (confirm(`Are you sure you want to ban user ${message.userName}`)) {
            this.messages = this.messages.filter(m => m.userName !== message.userName);
            this.chatService.banUser(message.id).subscribe();
        }
    }

    isUserBanned(): boolean {
        if (this.room?.liveAccountId) {
            return this.cu.isUserBanned(this.room.liveAccountId);
        }
        return false;
    }

    close(): void {
        this.closeClicked.emit();
    }

    ngOnDestroy(): void {
        if (this.fetchMessagesSubs) {
            this.fetchMessagesSubs.unsubscribe();
        }
        if (this.enterRoomSubs) {
            this.enterRoomSubs.unsubscribe();
        }
        if (this.getMessagesSubs) {
            this.getMessagesSubs.unsubscribe();
        }
    }
}
