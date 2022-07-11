import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment as env } from '../../environments/environment';

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
  constructor(private http: HttpClient) { }

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
    this.http.get(env.apiurl + 'notification/un-read', this.httpOptions).subscribe(data => {
      this.allNotifcations = data;
       console.log(this.allNotifcations.data);
      this.pageLoader = false;
    });
  }


}
