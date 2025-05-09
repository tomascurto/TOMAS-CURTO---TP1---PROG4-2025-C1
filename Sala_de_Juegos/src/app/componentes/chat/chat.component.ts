import { Component, OnInit, inject, Input } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Firestore, collection, collectionData, addDoc, query, orderBy, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserInterface } from '../../user.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

interface ChatMessage {
  uid: string;
  displayName: string;
  message: string;
  timestamp: any;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports:[CommonModule, FormsModule],
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  currentUser: UserInterface | null = null;
  messages$: Observable<ChatMessage[]> | null = null;
  newMessage: string = '';
  @Input() visible = false;
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private chatService = inject(ChatService);

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.messages$ = this.chatService.getMessages(); 
      } else {
        this.messages$ = null; 
      }
    });
  }

  toggleChat() {
    this.visible = !this.visible;
  }

  async sendMessage() {
    if (!this.newMessage.trim() || !this.currentUser) return; 

    await this.chatService.sendMessage(
      this.currentUser.displayName ?? 'Usuario',  
      this.newMessage                   
    );

    this.newMessage = '';  
  }
}
