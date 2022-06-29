import {Injectable} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {environment as env} from '../../../environments/environment';


var vcToken = localStorage.getItem('vctoken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer '+vcToken
      })
    }



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
      gender:frmAr.gender,
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

  //
  logout(){
      this.http.post(env.apiurl+'logout', httpOptions);
  }

  //add vaccine from chart

  addVaccine(data:any){
    return this.http.post(env.apiurl+'add-vaccine',data,httpOptions );
  }

  //add vaccine form dashboard
  addVaccineFromDashboard(data:any){
    return this.http.post(env.apiurl+'store-vaccine-records',data,httpOptions );
  }

  // add member
  addMember(data:any = []){
    return this.http.post(env.apiurl+'member/store',data,httpOptions );
  }

  // update member
  updateMember(data:any = [],mid:any){
    return this.http.put(env.apiurl+'member/update/'+mid,data,httpOptions );
  }

  // delete member
  deleteMember(id:any){
    return this.http.delete(env.apiurl+'member/delete/'+id,httpOptions );
  }



  ngOnInit(): void {
  }

}
