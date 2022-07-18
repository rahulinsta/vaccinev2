import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';
import { MainserviceComponent } from '../services/mainservice/mainservice.component';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment as env} from '../../environments/environment';
import {Router} from "@angular/router";
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isSubmitted:boolean = false
  isSubmit:boolean = false
  successMsg:any;
  errmsg:any;
  token:any;  
  formArr={email:'',password:''};
  switchClass = "email";
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.India];
  maxLength:any = 15;
  form = new UntypedFormGroup({
    type: new UntypedFormControl('email', [Validators.required]),
    password: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [Validators.required]),    
  });


  constructor(private usrObj:MainserviceComponent,private http:HttpClient,private router: Router) { }

  ngOnInit(): void { 
    var userId = localStorage.getItem('userid');
    localStorage.removeItem('recovery-data');
    localStorage.removeItem('verificationId');   
    // console.log(userId);
    // console.log(localStorage.getItem('vctoken'));

    if(userId){
      this.router.navigate(['/dashboard']);
    }
  }

  get f(){
    return this.form.controls;
  }
  
  submit(){
    this.isSubmitted = true; 
    this.isSubmit = true;
    this.errmsg = '';
    // this.formArr.email = this.form.value.email;
    // this.formArr.password = this.form.value.password;
    const PhoneNum: any = this.form.value.email;
    const formData = this.form.value;
    if(this.switchClass === 'phone'){
      formData.email = PhoneNum?.e164Number;
    } 
    this.usrObj.login(formData).subscribe((data:any)=>{
      //this.isLoading = false;
      this.isSubmit = false;
      if (data.status){ 
         //this.redirectsAfterLogin(data);
        this.token = data.token;
        localStorage.setItem('userid', data.data.id);
        localStorage.setItem('userdob', data.data.dob);
        localStorage.setItem('uname', data.data.uName);
        localStorage.setItem('vctoken', this.token);
        localStorage.setItem('ufname', data.data.first_name);
        localStorage.setItem('ufullname', data.data.name);

        this.router.navigate(['/dashboard']);


      }else{
        this.errmsg = data.message;
  
      }
    },error=> {
      this.errmsg  = 'Internal Server Error.. Your login could not be completed.';
      this.isSubmit = false;
    });



  }


  getTypeVal(e:any){
    const inputVal = e.target.value;
    this.isSubmitted = false;
    this.errmsg = '';
    this.form.reset();
    if(inputVal === 'email'){
      this.switchClass = 'email';
      this.form.get('type')?.setValue('email');
      this.form.controls['email'].setValidators([Validators.pattern(this.emailRegex), Validators.required]);
      this.form.controls['email'].updateValueAndValidity();      
      return;
    }
    if(inputVal === 'phone'){
      this.switchClass = 'phone';
      this.form.get('type')?.setValue('phone');
      this.form.controls['email'].setValidators([Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10), Validators.required]);
      this.form.controls['email'].updateValueAndValidity();
      return;
    }
  }


}
