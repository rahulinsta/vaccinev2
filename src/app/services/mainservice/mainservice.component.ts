import {Injectable} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment as env} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-mainservice',
  templateUrl: './mainservice.component.html',
  styleUrls: ['./mainservice.component.css']
})
export class MainserviceComponent implements OnInit {

  constructor(private http:HttpClient) { }

//user sign up
  register(frmAr:any = []){
    return this.http.post(env.apiurl+'register', {
      phone_no:frmAr.phone,
      email:frmAr.email,
      fname:frmAr.fname,
      lname:frmAr.lname,
      dob: frmAr.dob,
      emergency_number: frmAr.emgNo,
      password: frmAr.password,
      password_confirmation: frmAr.cpassword,
      blood_group: frmAr.bloodGroup
    }).pipe(rawData => {return rawData;});
  }


  //user login

  login(frmAr:any = []){
    return this.http.post(env.apiurl+'login', {
      username:frmAr.email,
      password: frmAr.password
    }).pipe(rawData => {return rawData;});
  }



  ngOnInit(): void {
  }

}
