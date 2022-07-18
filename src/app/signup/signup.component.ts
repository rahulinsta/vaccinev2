import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MainserviceComponent } from '../services/mainservice/mainservice.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { Router } from "@angular/router";
import { passwordMatch } from './confirm-password.validator';
import firebase from 'firebase';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  isSubmitted: boolean = false
  isSubmit: boolean = false
  successMsg: boolean = false;
  errmsg: boolean = false;
  emailErr: any;
  passErr1: any;
  passErr2: any;
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  reCaptchaVerifier:any;
  isSendMOTP: boolean = false;
  isSendEOTP: boolean = false;
  formArr={};
  maxDate:any;
  message: any = { status: true, msg: [] };
  maxLength:any = 15;
  form = new FormGroup({
    phone: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    fname: new FormControl('', [Validators.required]),
    lname: new FormControl('', [Validators.required]),
    mname: new FormControl(''),
    dob: new FormControl('', [Validators.required]),
    emgNo: new FormControl(''),
    bloodGroup: new FormControl(''),
    password: new FormControl('', [Validators.required]),
    cpassword: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required])
  },
    [passwordMatch('password', 'cpassword')]
  );

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.India];
  constructor(private usrObj: MainserviceComponent, private http: HttpClient, private router: Router) {
    localStorage.removeItem('regData');
    localStorage.removeItem('verificationId');
    localStorage.removeItem('isVerifyP');
    localStorage.removeItem('recovery-data');
    localStorage.removeItem('verificationId');   
  }

  ngOnInit(): void {
    var userId = localStorage.getItem('userid');
    this.getmaxDate();
    this.form.patchValue({
      'dob': this.maxDate
    });

    if (userId) {
      this.router.navigate(['/login']);
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(env.firebase);
    }
    // this.formArr = JSON.parse(localStorage.getItem('regData') || '{}');
    // if(this.formArr){
    //   this.form.patchValue(this.formArr);
    // }
    this.reCaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {size: 'invisible'})
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    this.message = { status: true, msg: [] };
    this.isSubmit = true;
    this.isSubmitted = true;
    if (this.form.invalid) {
      this.isSubmit = false;
      return
    }
    const PhoneNum: any = this.form.value.phone;
    // console.table(this.form.value);
    // return;
    const formData = this.form.value;
    formData.phone = PhoneNum?.e164Number;
    localStorage.setItem('regData', JSON.stringify(formData));
    if (this.form.value.phone) {
      const num = PhoneNum?.e164Number;
      firebase.auth().signInWithPhoneNumber(num, this.reCaptchaVerifier).then(result => {
        localStorage.setItem('verificationId', JSON.stringify(result.verificationId));
        this.isSendMOTP = true;
        this.isSendEOTP = true;
        this.sendToVerify();
      
      })
        .catch(error => {
          // console.error('Error :', error);
          this.isSendEOTP = false;
          this.isSendEOTP = false;
          this.isSubmit = false;
          this.message.status = false;
          if(error.code === "auth/invalid-phone-number"){
            this.message.msg.push('The phone number provided is incorrect. ')
          } else{
            this.message.msg.push(error?.message)
          }
          
          this.sendToVerify();
        });
    }

    // if (this.form.value.email) {
    //   const formData = {
    //     "email" : this.form.value.email
    //   }
    //   // console.log(formData);
    //   this.usrObj.sendEmailOtp(formData).subscribe((res:any) => {
    //   //   console.log(result);
    //     if(res.status){
    //       this.isSendEOTP = true;
    //     } else{
    //       this.message.status = false;          
    //       this.message.msg.push(res?.message);          
    //       this.isSendEOTP = false;
    //     }
    //     this.sendToVerify()
    //   },
    //   (err:any)=>{
    //     let errData = err.error.errors;
    //     for(let key in errData){
    //       this.message.msg.push(errData[key][0]);
    //     }
    //     if(errData == undefined || errData == null){
    //       this.message.msg.push('Something went wrong. Please try later');
    //     }
    //     this.message.status = false;
    //     this.isSendEOTP = false;
    //     this.isSubmit = false;  
    //   });
      
    // } else{
    //   this.isSendEOTP = true;
    //   this.sendToVerify();
    // }

   

    

    // this.formArr.phone = this.form.value.phone;
    // this.formArr.email = this.form.value.email;
    // this.formArr.fname = this.form.value.fname;
    // this.formArr.lname = this.form.value.lname;
    // this.formArr.dob = this.form.value.dob;
    // this.formArr.emgNo = this.form.value.emgNo;
    // this.formArr.bloodGroup = this.form.value.bloodGroup;
    // this.formArr.password = this.form.value.password;
    // this.formArr.cpassword = this.form.value.cpassword;
    // this.formArr.gender = this.form.value.genderType;


    // this.usrObj.register(this.formArr).subscribe((data:any)=>{
    //   console.log('step-1');
    //   this.isSubmit = false;  
    //   if (data.status){
    //     this.successMsg = true;
    //     this.successMsg = data.message;
    //     this.form.reset();
    //     this.isSubmitted = false;  


    //     setTimeout(() => {
    //       this.successMsg = false;
    //       this.router.navigate(['/login']);
    //     }, 3000);

    //     //this.router.navigate(['register-verify']);
    //   }else{
    //     console.log('yes inside the error message');
    //     this.errmsg = true;
    //     this.errmsg = data.message+data.data;
    //     setTimeout(() => {
    //       this.errmsg = false;
    //     }, 3000);

    //     console.log(this.errmsg);
    //   }
    // },
    // error=> {
    //   if(error.error.errors.email){
    //     this.emailErr =error.error.errors.email[0]; 
    //   }

    //   if(error.error.errors.password){
    //     this.passErr1 =error.error.errors.password[0]; 
    //     this.passErr2 =error.error.errors.password[1]; 
    //   }


    //   //this.errmsg  = 'Internal Server Error.. You Registration could not be completed.';
    //   this.isSubmit = false;  

    // });




  }

  sendToVerify(){
    if (this.isSendEOTP && this.isSendMOTP) {     
      localStorage.setItem('isVerifyP', 'true');
      this.isSubmit = false;
      this.router.navigate(['verify-otp']);

    }
  }

  //calculate maxdate

  getmaxDate(){
    var dtToday = new Date();
  
    var month:any = dtToday.getMonth() + 1;
    var day:any = dtToday.getDate();
    var year:any = dtToday.getFullYear();
  
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
  
     this.maxDate = year + '-' + month + '-' + day;    
    
  }

  


}
