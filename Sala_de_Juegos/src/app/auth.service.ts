import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { UserInterface } from './user.interface';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  user$ = user(this.auth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  //#region register
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
  //#endregion

  //#region login
  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.auth,
      email,
      password,
    ).then(()=>{});
    return from(promise);
  }
  //#endregion

  //#region logout
  logout(): Observable<void> {
    const promise = signOut(this.auth);
    return from(promise);
  }
  //#endregion
}
