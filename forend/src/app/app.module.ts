import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EnterComponent } from './enter/enter.component';

import { routing } from './app.routes';
import { UserContentComponent } from './user-content/user-content.component';
import { StatsComponent } from './user-content/stats/stats.component';
import { ChatboxComponent } from './user-content/chatbox/chatbox.component';
import { CurrentUserService } from './current-user.service';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ContentAuthGuard } from './content-auth-guard.service';
import { LoginAuthGuard } from './login-auth-guard.service';
import { ChatService } from './user-content/chat.service';

@NgModule({
  declarations: [
    AppComponent,
    EnterComponent,
    UserContentComponent,
    StatsComponent,
    ChatboxComponent
  ],
  imports: [
    BrowserModule,
    routing,
    HttpModule,
    FormsModule
  ],
  providers: [
    CurrentUserService,
    ContentAuthGuard,
    LoginAuthGuard,
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
