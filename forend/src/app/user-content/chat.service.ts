import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CurrentUserService } from '../current-user.service';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService {

  public dif = 0;

  constructor(private http: Http, private currentUserService: CurrentUserService) { }

  getMoreDayMessages() {
    return this.http
      .get(`api/message/${this.currentUserService.getUser().name}/${this.dif++}`)
      .map(response => response.json());
  }

}
