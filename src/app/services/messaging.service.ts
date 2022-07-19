import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { MainserviceComponent } from './mainservice/mainservice.component';
@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  messaging = firebase.messaging();
  currentMessaging = new BehaviorSubject(null);
  tokenFB: any;
  constructor(private mainService: MainserviceComponent, private router: Router) { }

  getPermission() {
    this.messaging.requestPermission().then(() => {
      console.log("Notification permission granted");
      return this.messaging.getToken();
    }).then(token => {
      console.log(token);
      this.fcmToken(token);
    }).catch((err) => {
      console.error("Unable to get permission to notify: ", err);
    })
  }

  delToken() {
     this.messaging.getToken().then(t =>{
      return t;
    }).then(token => {
      console.log(token);
      this.messaging.deleteToken(token);
      this.delfcmToken(token);
      // this.fcmToken(token);
    }).catch((err) => {
      console.error("Unable to get permission to notify: ", err);
    })
  }

  receiveMessage() {
    this.messaging.onMessage((payload) => {
      console.log("Message received", payload);
      this.currentMessaging.next(payload)
    })
  }
  fcmToken(token: any) {
    const Token = {
      "token": token
    }
    this.mainService.saveFCMToken(Token).subscribe((res: any) => {
      console.log(res.message)
    }, (err: any) => {
      console.error('Unable to get permission to notify.', err)
    })
  }
  delfcmToken(token: any) {
    const Token = {
      "token": token
    }
    this.mainService.delFCMToken(Token).subscribe((res: any) => {
      console.log(res.message);
      if(res.status){
        this.mainService.logout().subscribe((data: any) => {
          if (data.status) {
            localStorage.clear();        
            this.router.navigate(['/login']);
          }
        });
      }
      
    
    }, (err: any) => {
      console.error('Unable to get permission to notify.', err)
    })
  }
}
