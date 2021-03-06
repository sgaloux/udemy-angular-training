import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output()
  closeSideNav = new EventEmitter<void>();
  isAuth$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.ApplicationState>
  ) {}

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuthenticated);
  }

  onClose() {
    this.closeSideNav.emit();
  }

  onLogout() {
    this.authService.logout();
    this.onClose();
  }
}
