import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import {Router} from "@angular/router"
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { MainserviceComponent } from '../services/mainservice/mainservice.component';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userId:any;
  uname:any;
  currMember:any;
  userData :any = [];
  members:any = [];
  fletter:any;
  
  //memberid:any;
  diseaseList:any = [];
  vaccineList:any = [];
  memberVaccineList:any = [];
  
// users List
  userName: any;
  dob: any;
  pincode: any;
  city: any;
  state: any;
  country: any;
  email: any;
  phone: any;
  fullName: any;
  gender: any;
  bloodGroup: any;
  

  memberId:any;
  memberAge:any;
  cert_url:any;
  imageSrc:any;
  pageLoader:boolean=false;

  httpOptions: any = {};



  

  constructor(private router: Router,private http: HttpClient,private usrObj:MainserviceComponent 
    ) { }

  ngOnInit(): void { 
    if (this.getToken()) {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + this.getToken()
        })
      } 
    }
    

    this.userId = localStorage.getItem('userid');
    if(this.userId == null || this.userId == undefined ){
      this.router.navigate(['/login']);
    }

    this.uname = localStorage.getItem('ufname');
    var dob = localStorage.getItem('userdob');
    
    this.memberAge =  this.getAge(dob);
    this.userProfile();
    this.getMembers();
    this.getVaccinebyMemberId(this.userId);
    
    this.currMember = this.userId;    
  }


  getToken() {
    if (!!localStorage.getItem("vctoken")) {
      return localStorage.getItem("vctoken")
    } else {
      return false;
    }
  }

  openInfo(e: any) {

    var myCollapse = document.getElementById('user--info')
    new bootstrap.Collapse(myCollapse!);
    e.classList.toggle('open')
  }

 


  showQrcode(certificateUrl:any) {
    this.cert_url = certificateUrl;
    var modalId = document.querySelector("#qrcode");
    var myModal = new bootstrap.Modal(modalId!, {
      keyboard: false
    })
    myModal.show();
    
  }

  editProfileModel() {
    var modalId = document.querySelector("#editProfile");
    var myModal = new bootstrap.Modal(modalId!, {
      keyboard: false
    })
    myModal.show();
  }


  

  //get user profile data

  userProfile(user_id=this.userId){
    console.log('get user profile data');
    this.pageLoader = true;
    this.http.get(env.apiurl + 'user-profile?userId=' + user_id, this.httpOptions).subscribe((data:any) => {
      this.userData = data;
      console.log(data);
      this.userName = this.userData.data.first_name;
      this.dob = this.userData.data.dob;
      this.email = this.userData.data.email;
      this.phone = this.userData.data.phone_no;
      this.city = this.userData.data.city;
      this.state = this.userData.data.state;
      this.pincode = this.userData.data.zipcode;
      this.fullName = this.userData.data.name;
      this.gender = this.userData.data.gender;
      this.bloodGroup = this.userData.data.blood_group;
      this.fletter = this.userName.charAt(0);
      this.memberAge = this.getAge(this.userData.data.dob);
      this.pageLoader = false;
    }
    
    );
  }


  // get members

  getMembers(){
    this.http.get(env.apiurl + 'member', this.httpOptions).subscribe(data => {
        this.members = data;
        //console.log(this.members.data);
    });

  }



  getDiseaseId(e:any){
    var diseaseId = e.target.value; 
    this.getVaccine(diseaseId);
    
  }

  // get members based on the age
  onAgechange(e:any){
    var age = e.target.value;
    if(age == '18'){
      age = 1;
    }else{
      age = 2;
    }

    this.http.get(env.apiurl + 'member?age=' + age, this.httpOptions).subscribe(data => {
      this.members = data;
      //console.log(this.members.data);
    });

  }

  //get member on chage
  getMemberid(e:any){
    // console.log(e);
    this.memberId = e.target.value;
    this.userProfile(e.target.value);
    this.getVaccinebyMemberId(this.memberId);
    this.currMember = '';
    this.currMember = e.target.value;
    // console.log(this.currMember)
    
  }

  getVaccine(vendorId:any){
    this.http.get(env.apiurl + 'get-vendor-by-disease?diseaseId=' + vendorId, this.httpOptions).subscribe(data => {
        this.vaccineList = data;
        //console.log('vaccine list');
        //console.log(this.vaccineList.data);
    });

  }


  getVaccinebyMemberId(memberId:any){
    this.http.get(env.apiurl + 'vaccine-data?userId=' + memberId, this.httpOptions).subscribe((data:any) => {
        this.memberVaccineList = data;
       
        console.log('member vaccine list');
        console.log(this.memberVaccineList.data);
    });

  }


  //calculate age
  getAge(dateString:any) {
      var newdate = dateString.split("-").reverse().join("-");
      var today = new Date();
      var birthDate = new Date(newdate);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
      {
          age--;
      }
      return age;
  }

  




}
