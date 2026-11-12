import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Chatservice } from '../../services/chat.service';
import { ChatComponent } from './chat.component';

describe('ChatComponent', () => {
  let fixture: ComponentFixture<ChatComponent>;
  let chatService: jasmine.SpyObj<Chatservice>;

  beforeEach(async () => {
    chatService = jasmine.createSpyObj<Chatservice>('Chatservice', ['joinRoom', 'leaveRoom'], {
      messages$: of([]),
      connected$: of(false)
    });

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ roomId: 'demo' })) } },
        { provide: Chatservice, useValue: chatService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    fixture.detectChanges();
  });

  it('should join the room from the route', () => {
    expect(fixture.componentInstance.roomId).toBe('demo');
    expect(chatService.joinRoom).toHaveBeenCalledWith('demo');
  });
});
