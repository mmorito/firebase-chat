import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  public isLoggedIn = false;
  public displayName = '';

  public items: any[];

  public message = '';

  constructor(public auth: AngularFireAuth, private db: AngularFireDatabase) {
    this.auth.authState
      .pipe(map((u) => !!u))
      .subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
        db.list('chat/items')
          .valueChanges()
          .subscribe((items: any[]) => {
            this.items = [];
            items.forEach(item => {
              item.date = new Date(item.date);
              this.items.push(item);
            });
          });
      });
  }

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      this.displayName = '';
      if (user) {
        this.displayName = user.displayName;
      }
    });
  }

  public login(providerName): void {
    let provider: any;
    switch (providerName) {
      case 'github': // github
        provider = new firebase.auth.GithubAuthProvider();
        provider.setCustomParameters({
          allow_signup: 'false',
        });
        break;
      default:
        // google
        provider = new firebase.auth.GoogleAuthProvider();
        break;
    }
    this.auth.signInWithPopup(provider);
  }

  public logout(): void {
    this.auth.signOut();
  }

  public send(): void {
    if (!this.message) {
      return;
    }
    this.db.list('chat/items').push({
      displayName: this.displayName,
      message: this.message,
      date: new Date().getTime(),
    });
    this.message = '';
  }
}
