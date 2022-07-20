import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainserviceComponent } from '../services/mainservice/mainservice.component';
import { MessagingService } from '../services/messaging.service';
@Component({
  selector: 'app-verified-account',
  templateUrl: './verified-account.component.html',
  styleUrls: ['./verified-account.component.css']
})
export class VerifiedAccountComponent implements OnInit {

  constructor(private usrObj: MainserviceComponent, private msgService: MessagingService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogout() {
    // console.log(this.msgService.getFCMToken());
    if(this.usrObj.getToken()){
      if (Notification.permission !== "granted") {
        this.usrObj.logout().subscribe((data: any) => {
          if (data.status) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        });
      } else{
        this.msgService.delToken();
      }
    } else{
      this.router.navigate(['/login']);
    }
    
   

  }
}
