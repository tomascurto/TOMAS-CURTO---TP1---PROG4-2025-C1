import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, query, orderBy, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private firestore = inject(Firestore);

  getMessages(): Observable<any[]> {
    const messagesRef = collection(this.firestore, 'chats');
    const q = query(messagesRef, orderBy('timestamp'));
    return collectionData(q, { idField: 'id' });
  }

  async sendMessage(displayName: string, message: string): Promise<void> {
    const user = getAuth().currentUser;
    if (!user) return;  // 

    const messagesRef = collection(this.firestore, 'chats');
    const datos = {
      uid: user.uid,          
      displayName,           
      message,
      timestamp: Timestamp.now()  
    };

    await addDoc(messagesRef, datos);  
  }
}
