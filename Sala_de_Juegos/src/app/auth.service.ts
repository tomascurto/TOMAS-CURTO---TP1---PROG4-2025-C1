import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { UserInterface } from './user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  user$ = user(this.auth);
  private currentUserSubject = new BehaviorSubject<UserInterface | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private router = inject(Router);

  //#region register
  register(email: string, name: string, password: string, extraData: { lastName: string; age: string }): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password)
    .then(async (response) => {
      try {

        await updateProfile(response.user, { displayName: `${name} ${extraData.lastName}` });
        const userRef = doc(this.firestore, `users/${response.user.uid}`);
        console.log("parada 2");
        await setDoc(userRef, {
          uid: response.user.uid,
          email: response.user.email,
          name,
          lastName: extraData.lastName,
          age: extraData.age
        });
        console.log("parada 3");
        this.currentUserSubject.next({
          email: response.user.email!,
          displayName: `${name} ${extraData.lastName}`,
        });
      } catch (err) {
        console.error('Error dentro del bloque async del register:', err);
        throw err;
      }
    });
    
    return from(promise);
  }
  //#endregion

  //#region login
  login(email: string, password: string): Observable<void> {
    console.log('entro al log');
    const promise = signInWithEmailAndPassword(
      this.auth,
      email,
      password,
    ).then((response) => {
      this.currentUserSubject.next({
        email: response.user.email!,
        displayName: response.user.displayName || '',
      });
    });
    return from(promise);
  }
  //#endregion

  //#region logout
  logout(): Observable<void> {
    const promise = signOut(this.auth).then(() => {
      this.currentUserSubject.next(null);
    });
    return from(promise);
  }
  //#endregion
}
