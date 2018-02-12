import { Component, OnInit, Output, EventEmitter, NgZone, ViewChild, ElementRef } from '@angular/core';
import { CurrentUserService } from '../../current-user.service';
import { ChatService } from '../chat.service';

declare var io;

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html'
})
export class ChatboxComponent implements OnInit {

  @ViewChild('chatArea') private chatArea: ElementRef;

  public messageModel = "";
  public today;
  public daysMessages: Array<any> = [];
  public isLoading: boolean = false;
  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.today = new Date();
    this.isLoading = true;
    this.chatService.getMoreDayMessages().subscribe(({ messages, todayDate }) => {
      this.isLoading = false;
      if (Array.isArray(messages) && messages.length > 0) {
        this.daysMessages.unshift({
          date: messages[0].messageDate,
          messages
        });
      } else {
        this.daysMessages.unshift({
          date: todayDate,
          messages: []
        });
      }

      this.scrollToBottom();

    });
  }

  moreDayClick() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.chatService.getMoreDayMessages().subscribe(({ messages, todayDate }) => {
        this.isLoading = false;
        if (Array.isArray(messages) && messages.length > 0) {
          this.daysMessages.unshift({
            date: messages[0].messageDate,
            messages
          });
        }
      });
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatArea.nativeElement.scrollTop = this.chatArea.nativeElement.scrollHeight;
    }, 300);
  }

  sendMessage() {

    this.daysMessages[this.daysMessages.length - 1].messages.push({
      messageTxt: this.messageModel,
      isFromUser: true
    });
    this.scrollToBottom();

    this.chatService.sendMessage(this.messageModel).subscribe(res => {
      this.daysMessages[this.daysMessages.length - 1].messages.push({
        messageTxt: res.respMessage,
        isFromUser: false
      });
      this.scrollToBottom();
    });

    this.messageModel = "";

  }
}
