import { Component, OnInit } from '@angular/core';
import { MainserviceComponent } from '../services/mainservice/mainservice.component';
import {Router} from "@angular/router"
import * as bootstrap from 'bootstrap';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment as env } from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userId: any;
  uname:any;
  pageUrl:any = '';

  members: any = [];
  diseaseList: any = [];
  vaccineList: any = [];
  memberVaccineList: any = [];
  // forms
 
  isSubmitted: boolean = false;
  isSubmit: boolean = false;
  isSubmittedVc: boolean = false;
  age: any;
  successMsg: any;
  errmsg: any;
  httpOptions: any = {};
  maxDate: any;
  imageSrc: any;
  memberId: any;
  currMember: any;
  strTime:any;
  unreadNotifications:any=[];
  totalUnreadNotification:any;
 
 

  // form data
  form = new UntypedFormGroup({
    selectAge: new UntypedFormControl('', [Validators.required]),
    selectMember: new UntypedFormControl('', [Validators.required]),
  });

  addvcFrm = new UntypedFormGroup({
    diseaseId: new UntypedFormControl('', [Validators.required]),
    // vendorId: new UntypedFormControl('', [Validators.required]),
    vaccine_date: new UntypedFormControl('', [Validators.required]),
    vaccine_time: new UntypedFormControl('', [Validators.required]),
    vaccine_location: new UntypedFormControl('', [Validators.required]),
    dose: new UntypedFormControl('', [Validators.required]),
    file: new UntypedFormControl(''),
    fileSource: new UntypedFormControl(''),
  });


  constructor(private usrObj: MainserviceComponent, private router: Router, private http: HttpClient) { }

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

    var e = document.getElementById("navbar");
    this.uname = localStorage.getItem('ufname');
    //console.log(this.uname);
    this.pageUrl = this.router.url;
    // console.log(this.router.url)
    this.getDisease();
    this.getmaxDate();
    this.currMember = this.userId; 
    this.getCurrentTime();
    this.getUnreadNotifications();
  }

  getToken() {
    if (!!localStorage.getItem("vctoken")) {
      return localStorage.getItem("vctoken")
    } else {
      return false;
    }
  }

  onLogout(){
    // console.log(this.usrObj.getToken());
    this.usrObj.logout().subscribe((data:any)=>{
      if (data.status){
        localStorage.clear();
        this.router.navigate(['/login']);
      }
     
  });
   
    
  }
  toggleMenu(e: any) {
    // console.log(e.currentTarget);
    const btn = e.currentTarget;
    btn.getAttribute('aria-expanded') == 'false' ? btn.setAttribute('aria-expanded', "true") : btn.setAttribute('aria-expanded', "false")
    var myCollapse = document.getElementById('navbarSupportedContent')
    // return new bootstrap.Collapse(myCollapse)
    new bootstrap.Collapse(myCollapse!, {
      toggle: false
    })
  }


  addVaccine() {
    var modalId = document.querySelector("#addVaccineStep1");
    var myModal = new bootstrap.Modal(modalId!, {
      keyboard: false
    })
    myModal.show(); 
  }


  addVaccineStep2() {
    this.addvcFrm.patchValue({
      'vaccine_date': this.maxDate,
    })
    var modalId = document.querySelector("#addVaccineStep2");
    var myModal = new bootstrap.Modal(modalId!, {
      keyboard: false
    })
    myModal.show();
  }

  hideVaccineModlefirst() {
    var modalId = document.querySelector("#addVaccineStep1");
    var myModal = new bootstrap.Modal(modalId!, {
      keyboard: false
    })
    myModal.hide();
  }


  

  getDiseaseId(e: any) {
    var diseaseId = e.target.value;
    this.getVaccine(diseaseId);

  }

  getDisease() {
    this.http.get(env.apiurl + 'get-disease', this.httpOptions).subscribe(data => {
      this.diseaseList = data;
      // console.log(this.diseaseList.data);
    });
  }

  onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
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



  get f() {
    return this.form.controls;
  }

  submit() {
    this.isSubmit = true;
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.isSubmit = false;
      return
    }
    this.age = this.form.value.selectAge;
    if (this.age == 18) {
      this.hideVaccineModlefirst();
      window.location.href = '/chart?user=' + this.memberId;
      //this.router.navigate(['/chart?user', 87]);
    } else {
      this.addVaccineStep2();
      this.isSubmit = false;
    }

  }

  get f2() {
    return this.addvcFrm.controls;
  }

  closeModal(id: any) {
    var closeModalId = document.querySelector(`#${id}`);
    var myModal = bootstrap.Modal.getOrCreateInstance(closeModalId!)
    myModal.hide();
  }

  submitVcfrm() {
    this.isSubmit = true;
    this.isSubmittedVc = true;
    if (this.addvcFrm.invalid) {
      this.isSubmit = false;
      return
    }

    var vcdata = {
      'userId': this.memberId,
      'diseaseId': this.addvcFrm.value.diseaseId,
      // 'vendorId': this.addvcFrm.value.vendorId,
      'vaccine_date': this.addvcFrm.value.vaccine_date,
      'vaccine_time': this.addvcFrm.value.vaccine_time,
      'vaccine_location': this.addvcFrm.value.vaccine_location,
      'dose': this.addvcFrm.value.dose,
      'upload_file': this.addvcFrm.value.file,
      'lat': 48.89899,
      'long': 68.49590,

    }

    this.usrObj.addVaccineFromDashboard(vcdata).subscribe((data: any) => {
      //this.isLoading = false; 
      this.isSubmit = false;
      if (data.status) {
        this.successMsg = data.message;
        this.closeModal('addVaccineStep2');
        this.closeModal('addVaccineStep1');
        setTimeout(() => {
          this.router.navigate(['/dashboard']).then(() => {
            window.location.reload();
          });
          // location.reload();

        }, 2000);
        //this.form.reset();
        //this.router.navigate(['register-verify']);
      } else {
        this.errmsg = data.message;
      }
    });





  }

  // get members based on the age
  onAgechange(e: any) {
    var age = e.target.value;
    if (age == '18') {
      age = 1;
    } else {
      age = 2;
    }

    this.http.get(env.apiurl + 'member?age=' + age, this.httpOptions).subscribe(data => {
      this.members = data;
      //console.log(this.members.data);
    });

  }

  //get member on chage
  getMemberid(e: any) {
    // console.log(e);
    this.memberId = e.target.value;
    // console.log(this.currMember)

  }


  getVaccine(vendorId: any) {
    this.http.get(env.apiurl + 'get-vendor-by-disease?diseaseId=' + vendorId, this.httpOptions).subscribe(data => {
      this.vaccineList = data;
      //console.log('vaccine list');
      //console.log(this.vaccineList.data);
    });

  }

  


  //calculate maxdate

  getmaxDate() {
     var dtToday = new Date();

    var month: any = dtToday.getMonth() + 1;
    var day: any = dtToday.getDate();
    var year: any = dtToday.getFullYear();

    if (month < 10)
      month = '0' + month.toString();
    if (day < 10)
      day = '0' + day.toString();

    this.maxDate = year + '-' + month + '-' + day;
  }

  // get current time

   getCurrentTime() {
    var dtToday = new Date();
    var hours:any = dtToday.getHours();
    var minutes:any = dtToday.getMinutes();
    //var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 24;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    if(hours < 9){
      hours = '0'+hours;
    }
    minutes = minutes < 10 ? '0'+minutes : minutes;
    //this.strTime = hours + ':' + minutes +' '+ ampm;
    this.strTime = hours + ':' + minutes;
    //console.log('currrent time');
    //console.log(this.strTime);
  }
  
  //get unread notifications
  getUnreadNotifications() {
    this.http.get(env.apiurl + 'notification/un-read', this.httpOptions).subscribe(data => {
      this.unreadNotifications = data;
      //console.log('unreadnotification');
       //console.log(this.unreadNotifications.data);
       this.totalUnreadNotification = this.unreadNotifications.data.length;
    });
  }


}
