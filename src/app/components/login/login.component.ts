import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  roomIdInput = '';
  invitedRoomId = '';

  displayName = '';

  constructor(private router: Router, route: ActivatedRoute) {
    route.queryParamMap.pipe(takeUntilDestroyed()).subscribe(params => {
      this.invitedRoomId = params.get('sala')?.trim() ?? '';
      this.roomIdInput = this.invitedRoomId;
    });
  }

  login(): void {
    const roomId = this.invitedRoomId || this.roomIdInput.trim();
    if (roomId) {
      void this.router.navigate(['/chat', roomId], {
        state: { displayName: this.displayName.trim() }
      });
    }
  }
}
