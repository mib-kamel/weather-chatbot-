import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule } from '@angular/http';

import { UserContentComponent } from './user-content.component';
import { StatsComponent } from './stats/stats.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { CurrentUserService } from '../current-user.service';
import { ChatService } from './chat.service';

describe('UserContentComponent', () => {
  let component: UserContentComponent;
  let fixture: ComponentFixture<UserContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserContentComponent, StatsComponent, ChatboxComponent ],
      imports: [FormsModule, RouterTestingModule, HttpModule],
      providers: [CurrentUserService, ChatService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
