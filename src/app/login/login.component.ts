import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';
import { MainserviceComponent } from '../services/mainservice/mainservice.component';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment as env} from '../../environments/environment';
import {Router} from "@angular/router"

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

  form = new UntypedFormGroup({
    password: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    
  });


  constructor(private usrObj:MainserviceComponent,private http:HttpClient,private router: Router) { }

  ngOnInit(): void { 
    var userId = localStorage.getItem('userid');
    console.log(userId);
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
    this.formArr.email = this.form.value.email;
    this.formArr.password = this.form.value.password;

    this.usrObj.login(this.formArr).subscribe((data:any)=>{
      //this.isLoading = false;
      this.isSubmit = false;
      if (data.status){ 
         //this.redirectsAfterLogin(data);
        this.token = data.token;
        localStorage.setItem('userid', data.data.id);
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



}
