import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  private readonly userDisposable: Subscription | undefined;
  public isLoggedIn = false;
  public displayName = '';

  constructor(public auth: AngularFireAuth) {
    this.userDisposable = this.auth.authState
      .pipe(map((u) => !!u))
      .subscribe((isLoggedIn) => this.isLoggedIn = isLoggedIn);
  }

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      this.displayName = '';
      if (user) {
        this.displayName = user.displayName;
      }
    });
  }

  public login(providerName): void {
    let provider: any;
    switch (providerName) {
      case 'github':  // github
        provider = new firebase.auth.GithubAuthProvider();
        provider.setCustomParameters({
          allow_signup: 'false',
        });
        break;
      default:  // google
        provider = new firebase.auth.GoogleAuthProvider();
        break;
    }
    this.auth.signInWithPopup(provider);
  }

  public logout(): void {
    this.auth.signOut();
  }


}
