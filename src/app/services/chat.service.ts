import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';
import { environment } from '../environment';
import { ChatMessage } from '../models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class Chatservice {
  private client?: Client;
  private readonly messageSubject = new BehaviorSubject<ChatMessage[]>([]);
  private readonly connectedSubject = new BehaviorSubject(false);

  readonly messages$ = this.messageSubject.asObservable();
  readonly connected$ = this.connectedSubject.asObservable();

  joinRoom(roomId: string): void {
    this.leaveRoom();

    const client = new Client({
      webSocketFactory: () => new SockJS(environment.websocketUrl),
      reconnectDelay: 3000,
      onConnect: () => {
        if (this.client !== client) {
          return;
        }
        client.subscribe(`/topic/${roomId}`, ({ body }) => {
          if (this.client === client) {
            const message: ChatMessage = JSON.parse(body);
            this.messageSubject.next([...this.messageSubject.value, message]);
          }
        });
        this.connectedSubject.next(true);
      },
      onWebSocketClose: () => {
        if (this.client === client) {
          this.connectedSubject.next(false);
        }
      }
    });

    this.client = client;
    client.activate();
  }

  leaveRoom(): void {
    const client = this.client;
    this.client = undefined;
    this.connectedSubject.next(false);
    this.messageSubject.next([]);
    void client?.deactivate();
  }

  sendMessage(roomId: string, message: ChatMessage): boolean {
    if (!this.client?.connected) {
      return false;
    }
    this.client.publish({
      destination: `/app/chat/${roomId}`,
      body: JSON.stringify(message)
    });
    return true;
  }
}
