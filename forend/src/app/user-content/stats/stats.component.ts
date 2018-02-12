import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { CurrentUserService } from '../../current-user.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit {

  public userName: string;
  public createdAt: string;

  constructor(private router: Router,
    private currentUserService: CurrentUserService,
    private zone: NgZone) { }

  forceUpdate() {
    this.zone.run(() => { });
  }

  ngOnInit() {
    const user = this.currentUserService.getUser();
    this.userName = user.name;
    this.createdAt = user.createdAt;

    this.currentUserService.getCurrentUser().subscribe(curUser => {
      this.userName = curUser.name;
      this.createdAt = curUser.createdAt;
      this.forceUpdate();
    });
  }

  logout() {
    this.currentUserService.logout();
    this.router.navigate(['/']);
  }

}
