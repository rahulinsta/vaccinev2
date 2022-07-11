import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { MessagingService } from '../services/messaging.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  uname: any;
  pageLoader: boolean = false;
  allNotifcations:any = [];
  httpOptions: any = {};
  constructor(private http: HttpClient, private msgService: MessagingService) { }

  ngOnInit(): void {
    this.uname = localStorage.getItem('ufname');
    if (this.getToken()) {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + this.getToken()
        })
      }
    }

    this.getAllNotifications();
    this.msgService.currentMessaging.subscribe((res:any)=>{
      if(res){
        this.getAllNotifications();
      }
     
    })
  }


  getToken() {
    if (!!localStorage.getItem("vctoken")) {
      return localStorage.getItem("vctoken")
    } else {
      return false;
    }
  }


  //get all notifications
  getAllNotifications() {
    this.pageLoader = true;
    this.http.get(env.apiurl + 'notification', this.httpOptions).subscribe((data:any) => {
      if(data.status){
        this.allNotifcations = data;
      }
   
      //  console.log(this.allNotifcations.data);
      this.pageLoader = false;
    });
  }


}
