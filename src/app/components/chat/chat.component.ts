import { CommonModule, Location } from '@angular/common';
import { Component, DestroyRef, ElementRef, OnDestroy, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatMessage } from '../../models/chat-message';
import { Chatservice } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messageContainer') messageContainer?: ElementRef<HTMLElement>;

  messageInput = '';
  userId = '';
  displayName = '';
  messageList: ChatMessage[] = [];
  roomId = '';
  invitationStatus = '';
  manualInvitationUrl = '';
  readonly connected$ = this.chatService.connected$;
  private scrollTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly chatService: Chatservice,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.chatService.messages$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(messages => {
      this.messageList = messages;
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        const container = this.messageContainer?.nativeElement;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    });

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.roomId = params.get('roomId')!;
      this.userId = Array.from(crypto.getRandomValues(new Uint32Array(2)), value => value.toString(16).padStart(8, '0')).join('');
      this.messageInput = '';
      const state = this.location.getState() as { displayName?: unknown } | null;
      const name = state?.displayName;
      const chosenName = typeof name === 'string' ? name.trim().slice(0, 24) : '';
      this.displayName = chosenName || `Invitado-${this.userId.slice(0, 6).toUpperCase()}`;
      this.invitationStatus = '';
      this.manualInvitationUrl = '';
      this.chatService.joinRoom(this.roomId);
    });
  }

  ngOnDestroy(): void {
    this.chatService.leaveRoom();
    clearTimeout(this.scrollTimer);
  }

  goToLogin(): void {
    void this.router.navigate(['/login']);
  }

  async copyInvitation(): Promise<void> {
    const roomId = this.roomId;
    const path = this.router.serializeUrl(this.router.createUrlTree(['/login'], { queryParams: { sala: roomId } }));
    const url = new URL(this.location.prepareExternalUrl(path), window.location.origin).href;
    let copied = false;
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
    } catch {
      // The link can still be selected when clipboard access is unavailable.
    }

    if (this.roomId === roomId) {
      this.manualInvitationUrl = copied ? '' : url;
      this.invitationStatus = copied ? 'Enlace copiado.' : 'Copia el enlace de invitación manualmente.';
    }
  }

  sendMessage(): void {
    if (this.messageInput.trim() && this.chatService.sendMessage(this.roomId, {
      message: this.messageInput,
      user: this.userId,
      displayName: this.displayName
    })) {
      this.messageInput = '';
    }
  }
}
