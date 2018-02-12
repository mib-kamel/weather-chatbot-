import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
import { CurrentUserService } from '../../current-user.service';
import { ChatService } from '../chat.service';

declare var io;

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html'
})
export class ChatboxComponent implements OnInit {

  public today;
  public daysMessages: Array<any> = [];
  public isLoading: boolean = false;
  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.today = new Date();
    this.isLoading = true;
    this.chatService.getMoreDayMessages().subscribe(messages => {
      this.isLoading = false;
      if (Array.isArray(messages) && messages.length > 0) {
        this.daysMessages.unshift({
          date: messages[0].messageDate,
          messages
        });
        console.log(this.daysMessages);
      }
    });
  }

  moreDayClick() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.chatService.getMoreDayMessages().subscribe(messages => {
        this.isLoading = false;
        if (Array.isArray(messages) && messages.length > 0) {
          this.daysMessages.unshift({
            date: messages[0].messageDate,
            messages
          });
          console.log(this.daysMessages);
        }
      });
    }
  }

}
