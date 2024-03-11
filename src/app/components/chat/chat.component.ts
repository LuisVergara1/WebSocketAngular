import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chatservice } from '../../services/chat.service';
import { Router,NavigationEnd, ActivatedRoute} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../models/chat-message';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule , FormsModule ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  messageInput: string = "";
  userId: string="";
  messageList: any[]=[];
  roomId: string ="";

  constructor(private chatService : Chatservice , private route:ActivatedRoute,private router: Router)
  {

  }
  goToLogin() {
    this.router.navigate(['/login']); 
  }


  ngOnInit(): void {
   this.userId = this.route.snapshot.params["userId"];
   this.roomId =this.route.snapshot.params["roomId"];
   this.chatService.joinRoom(this.roomId);
   this.lisenerMessage();
  }

  sendMessage(){
    if(this.messageInput.trim()=== "")
    {
      return;
    }
    const chatMessage={
      message: this.messageInput,
      user:this.userId
    } as ChatMessage
    this.chatService.sendMessage(this.roomId , chatMessage);
    this.messageInput= "";
  }

  lisenerMessage() {
    this.chatService.getMessageSubject().subscribe((messages: any) => {
      this.messageList = messages.map((item: any)=> ({
        ...item,
        message_side: item.user === this.userId ? 'sender': 'receiver'

      }))
      setTimeout(()=>
      {
        this.scrollToBottom();
      },100)
    
    });
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }



}
