import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import {Router} from "@angular/router"
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment as env } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userId:any;
  uname:any;
  userName:any;
  dob:any;
  pincode:any;
  city:any;
  state:any;
  country:any;
  email:any;
  phone:any;
  userData :any = [];
  members:any = [];
  fletter:any;
  constructor(private router: Router,private http: HttpClient, 
    ) { }

  ngOnInit(): void { 

    this.userId = localStorage.getItem('userid');
    if(this.userId == null || this.userId == undefined ){
      this.router.navigate(['/login']);
    }

    this.uname = localStorage.getItem('ufname');

    this.userProfile();
    this.getMembers();


  }

  openInfo(e: any) {

    var myCollapse = document.getElementById('user--info')
    new bootstrap.Collapse(myCollapse!);
    e.classList.toggle('open')
  }

  addVaccine() {
    var modalId = document.querySelector("#addVaccineStep1");
    var myModal = new bootstrap.Modal(modalId!, {
      keyboard: false
    })
    myModal.show();
  }

  selectAge(){
    
  }

  //get user profile data

  userProfile(){
    var vcToken = localStorage.getItem('vctoken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer '+vcToken
      })
    }
    this.http.get(env.apiurl + 'user-profile?userId='+this.userId, httpOptions).subscribe(data => {

      console.log('user profile data');
      this.userData = data;
      this.userName = this.userData.data.first_name;
      this.dob = this.userData.data.dob;
      this.email = this.userData.data.email;
      this.phone = this.userData.data.phone_no;
      this.city = this.userData.data.city;
      this.state = this.userData.data.state;
      this.pincode = this.userData.data.zipcode;
      this.fletter = this.userName.charAt(0);

    });
  }


  // get members

  getMembers(){

    var vcToken = localStorage.getItem('vctoken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer '+vcToken
      })
    }
    this.http.get(env.apiurl + 'member', httpOptions).subscribe(data => {
        console.log(data);
    });

  }




}
