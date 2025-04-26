import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  register(email: string, name: string, password: string, extraData: { lastName: string; age: string }): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (response) => {
        // Set display name en Firebase Auth
        await updateProfile(response.user, { displayName: name });

        // Guardar datos extra en Firestore
        const userRef = doc(this.firestore, `users/${response.user.uid}`);
        await setDoc(userRef, {
          uid: response.user.uid,
          email: response.user.email,
          name,
          ...extraData
        });
      });

    return from(promise);
  }
}
