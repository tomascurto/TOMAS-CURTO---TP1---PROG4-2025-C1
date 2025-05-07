import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user, setPersistence, browserLocalPersistence } from '@angular/fire/auth';
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
  private currentUserSubject = new BehaviorSubject<UserInterface | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private router = inject(Router);

  constructor() {
    this.setupPersistence(); 
    this.monitorAuthState();
  }

  private setupPersistence(): void {
    const auth = this.auth;
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('Persistencia configurada correctamente');
      })
      .catch((error) => {
        console.error('Error al establecer persistencia:', error);
      });
  }

  private monitorAuthState(): void {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUserSubject.next({
          email: user.email!,
          displayName: user.displayName || '',
        });
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  //#region register
  register(email: string, name: string, password: string, extraData: { lastName: string; age: string }): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (response) => {
        try {
          await updateProfile(response.user, { displayName: `${name} ${extraData.lastName}` });
          const userRef = doc(this.firestore, `users/${response.user.uid}`);
          await setDoc(userRef, {
            uid: response.user.uid,
            email: response.user.email,
            name,
            lastName: extraData.lastName,
            age: extraData.age
          });
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
    const promise = signInWithEmailAndPassword(this.auth, email, password).then((response) => {
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
