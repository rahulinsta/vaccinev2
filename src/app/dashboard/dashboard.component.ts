import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import {Router} from "@angular/router"
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { MainserviceComponent } from '../services/mainservice/mainservice.component';
import { FormGroup, FormControl, Validators} from '@angular/forms';

var vcToken = localStorage.getItem('vctoken');
const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Authorization': 'Bearer '+vcToken
  })
}


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
  isSubmitted:boolean= false;
  isSubmittedVc:boolean= false;
  age:any;
  memberid:any;
  diseaseList:any = [];
  vaccineList:any = [];
  successMsg:any;
  errmsg:any;
  memberId:any;

  form = new FormGroup({
    selectAge: new FormControl('', [Validators.required]),
    selectMember: new FormControl('', [Validators.required]),
  });

  addvcFrm = new FormGroup ({
    diseaseId: new FormControl('', [Validators.required]),
    vendorId: new FormControl('', [Validators.required]),
    vaccine_date: new FormControl('', [Validators.required]),
    vaccine_time: new FormControl('', [Validators.required]),
    vaccine_location: new FormControl('', [Validators.required]),
  });


  constructor(private router: Router,private http: HttpClient,private usrObj:MainserviceComponent 
    ) { }

  ngOnInit(): void { 

    this.userId = localStorage.getItem('userid');
    if(this.userId == null || this.userId == undefined ){
      this.router.navigate(['/login']);
    }

    this.uname = localStorage.getItem('ufname');

    this.userProfile();
    this.getMembers();
    this.getDisease();


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

  addVaccineStep2() {
    var modalId = document.querySelector("#addVaccineStep2");
    var myModal = new bootstrap.Modal(modalId!, {
      keyboard: false
    })
    myModal.show();
  }

  hideVaccineModlefirst(){
    var modalId = document.querySelector("#addVaccineStep1");
    var myModal = new bootstrap.Modal(modalId!, {
      keyboard: false
    })
    myModal.hide();
  }


  get f(){
    return this.form.controls;
  }

  submit(){
    this.isSubmitted = true;  
    if (this.form.invalid) {  
      return  
    }
    this.age = this.form.value.selectAge;
    if(this.age == 18){
      this.hideVaccineModlefirst();
      this.router.navigate(['/chart']);
    }else{
      this.addVaccineStep2();
    }

  }

  get f2(){
    return this.addvcFrm.controls;
  }

  submitVcfrm(){
    this.isSubmittedVc = true;  
    if (this.addvcFrm.invalid) {  
      return  
    }

    var vcdata = {
      'userId': this.memberId,
      'diseaseId': this.addvcFrm.value.diseaseId,
      'vendorId': this.addvcFrm.value.vendorId,
      'vaccine_date': this.addvcFrm.value.vaccine_date,
      'vaccine_time': this.addvcFrm.value.vaccine_time,
      'vaccine_location': this.addvcFrm.value.vaccine_location,
      'lat': 48.89899,
      'long': 68.49590,
      
    }

    this.usrObj.addVaccineFromDashboard(vcdata).subscribe((data:any)=>{
      //this.isLoading = false; 
      if (data.status){
        this.successMsg = data.message;
        setTimeout(()=>{                         
          location.reload();
      }, 2000);
        //this.form.reset();
        //this.router.navigate(['register-verify']);
      }else{
        this.errmsg = data.message;
      }
    });



    

  }

  //get user profile data

  userProfile(){
    this.http.get(env.apiurl + 'user-profile?userId='+this.userId, httpOptions).subscribe(data => {
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
    this.http.get(env.apiurl + 'member', httpOptions).subscribe(data => {
        this.members = data;
        console.log(this.members.data);
    });

  }

  getDisease(){
    this.http.get(env.apiurl + 'get-disease', httpOptions).subscribe(data => {
        this.diseaseList = data;
        console.log(this.diseaseList.data);
    });
  }


  getDiseaseId(e:any){
    var diseaseId = e.target.value; 
    this.getVaccine(diseaseId);
    
  }

  getMemberid(e:any){
    this.memberId = e.target.value;
    //console.log(this.memberId);
  }

    getVaccine(vendorId:any){
      this.http.get(env.apiurl + 'get-vendor-by-disease?diseaseId='+vendorId, httpOptions).subscribe(data => {
          this.vaccineList = data;
          console.log('vaccine');
          console.log(this.vaccineList.data);
      });


  }




}
