import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { MainserviceComponent } from '../services/mainservice/mainservice.component';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment as env} from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isSubmitted:boolean = false
  successMsg:any;
  errmsg:any;
  token:any
  formArr={email:'',password:''};

  form = new FormGroup({
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    
  });


  constructor(private usrObj:MainserviceComponent,private http:HttpClient) { }

  ngOnInit(): void { 
  }

  get f(){
    return this.form.controls;
  }
  
  submit(){
    this.isSubmitted = true; 

    this.formArr.email = this.form.value.email;
    this.formArr.password = this.form.value.password;

    this.usrObj.login(this.formArr).subscribe((data:any)=>{
      //this.isLoading = false;
      if (data.success){
         //this.redirectsAfterLogin(data);

        this.token = data.token;
        localStorage.setItem('userid', data.data.id);
        localStorage.setItem('uname', data.data.uName);
        localStorage.setItem('vctoken', this.token); 


      }else{
        this.errmsg = data.data;
  
      }
    },error=> {
      this.errmsg  = 'Internal Server Error.. You login could not be completed.';
      //this.isLoading = false;  
    });



  }



}
