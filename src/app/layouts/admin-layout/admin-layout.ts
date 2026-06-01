import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../core/services/auth.service';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { MSG } from '../../core/constants/messages.constants';

@Component({
  selector: 'app-admin-layout',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatExpansionModule,
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  public authService = inject(AuthService);
  private router = inject(Router);

  isExpanded = signal(true);
  toggleSidenav() {
    this.isExpanded.update(val => !val);
  }

  logout() {
    Confirm.show(
      MSG.TITLE.EXIT,
      MSG.CONFIRM.EXIT,
      MSG.YES.EXIT,
      MSG.CANCEL,
      () => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      () => {},
      {
        okButtonBackground: '#1d4ed8',
        titleColor: '#1e3a8a'
      }
    );
  }
}
