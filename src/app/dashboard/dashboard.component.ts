import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import {Router} from "@angular/router"
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { MainserviceComponent } from '../services/mainservice/mainservice.component';
import { UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';

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
  currMember:any;
  userData :any = [];
  members:any = [];
  fletter:any;
  isSubmitted:boolean= false;
  isSubmit:boolean= false;
  isSubmittedVc:boolean= false;
  age:any;
  //memberid:any;
  diseaseList:any = [];
  vaccineList:any = [];
  memberVaccineList:any = [];
  successMsg:any;
  errmsg:any;
  memberId:any;
  memberAge:any;
  cert_url:any;
  imageSrc:any;
  pageLoader:boolean=false;
  fullName:any;
  gender:any;
  bloodGroup:any;

  form = new UntypedFormGroup({
    selectAge: new UntypedFormControl('', [Validators.required]),
    selectMember: new UntypedFormControl('', [Validators.required]),
  });

  addvcFrm = new UntypedFormGroup ({
    diseaseId: new UntypedFormControl('', [Validators.required]),
    vendorId: new UntypedFormControl('', [Validators.required]),
    vaccine_date: new UntypedFormControl('', [Validators.required]),
    vaccine_time: new UntypedFormControl('', [Validators.required]),
    vaccine_location: new UntypedFormControl('', [Validators.required]),
    file: new UntypedFormControl(''),
    fileSource: new UntypedFormControl(''),
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
    this.getVaccinebyMemberId(this.userId);

    this.currMember = this.userId;
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


  onFileChange(event:any) {
    const reader = new FileReader();
     
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
     
      reader.onload = () => {
    
        this.imageSrc = reader.result as string;
      
        this.form.patchValue({
          fileSource: reader.result
        });
    
      };
    
    }
  }



  get f(){
    return this.form.controls;
  }

  submit(){
    this.isSubmit = true;  
    this.isSubmitted = true;  
    
    if (this.form.invalid) {  
      this.isSubmit = false;  
      return  
    }
    this.age = this.form.value.selectAge;
    if(this.age == 18){
      this.hideVaccineModlefirst();
      window.location.href = '/chart?user='+this.memberId;
      //this.router.navigate(['/chart?user', 87]);
    }else{
      this.addVaccineStep2();
      this.isSubmit = false;
    }

  }

  get f2(){
    return this.addvcFrm.controls;
  }

  submitVcfrm(){
    this.isSubmit = true;
    this.isSubmittedVc = true;  
    if (this.addvcFrm.invalid) {  
      this.isSubmit = false;
      return  
    }

    var vcdata = {
      'userId': this.memberId,
      'diseaseId': this.addvcFrm.value.diseaseId,
      'vendorId': this.addvcFrm.value.vendorId,
      'vaccine_date': this.addvcFrm.value.vaccine_date,
      'vaccine_time': this.addvcFrm.value.vaccine_time,
      'vaccine_location': this.addvcFrm.value.vaccine_location,
      'upload_file': this.addvcFrm.value.file,
      'lat': 48.89899,
      'long': 68.49590,
      
    }

    this.usrObj.addVaccineFromDashboard(vcdata).subscribe((data:any)=>{
      //this.isLoading = false; 
      this.isSubmit = false;
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

  userProfile(user_id=this.userId){
    console.log('get user profile data');
    this.pageLoader = true;
    this.http.get(env.apiurl + 'user-profile?userId=' + user_id, httpOptions).subscribe(data => {
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
      this.pageLoader = false;
    }
    
    );
  }


  // get members

  getMembers(){
    this.http.get(env.apiurl + 'member', httpOptions).subscribe(data => {
        this.members = data;
        //console.log(this.members.data);
    });

  }

  getDisease(){
    this.http.get(env.apiurl + 'get-disease', httpOptions).subscribe(data => {
        this.diseaseList = data;
        //console.log(this.diseaseList.data);
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

    this.http.get(env.apiurl + 'member?age='+age, httpOptions).subscribe(data => {
      this.members = data;
      //console.log(this.members.data);
    });

  }

  //get member on chage
  getMemberid(e:any){
    this.memberId = e.target.value;
    this.getVaccinebyMemberId(this.memberId);
    const [option] = e.target.selectedOptions
    var dob = option.dataset.dob;
    console.log('dob'+ dob);
    this.memberAge =  this.getAge(dob);
    console.log('memeber age');
    console.log(this.memberAge);
    this.userProfile(e.target.value);
    this.currMember = '';
    this.currMember = e.target.value;
    //console.log(this.currMember)
    
  }

  getVaccine(vendorId:any){
    this.http.get(env.apiurl + 'get-vendor-by-disease?diseaseId='+vendorId, httpOptions).subscribe(data => {
        this.vaccineList = data;
        //console.log('vaccine list');
        //console.log(this.vaccineList.data);
    });

  }


  getVaccinebyMemberId(memberId:any){
    this.http.get(env.apiurl + 'vaccine-data?userId='+memberId, httpOptions).subscribe(data => {
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
