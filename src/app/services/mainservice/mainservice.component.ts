import {Injectable} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {environment as env} from '../../../environments/environment';


// var vcToken = localStorage.getItem('vctoken');
//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Accept': 'application/json',
//         'Authorization': 'Bearer '+vcToken
//       })
//     }



@Injectable({
  providedIn: 'root'
})



@Component({
  selector: 'app-mainservice',
  templateUrl: './mainservice.component.html',
  styleUrls: ['./mainservice.component.css']
})
export class MainserviceComponent implements OnInit {

httpOptions:any={};

  constructor(private http:HttpClient) {
    
    



   }

   getHeader(){
     if (this.getToken()) {
      return {
         headers: new HttpHeaders({
           'Accept': 'application/json',
           'Authorization': 'Bearer ' + this.getToken()
         })
       }
     } else{
       return {
         headers: new HttpHeaders({
           'Accept': 'application/json'
         })
       }
     }
   }
  getToken() {
    if (!!localStorage.getItem("vctoken")) {
      return localStorage.getItem("vctoken")
    } else {
      return false;
    }
  }

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

  //logout user

  logout(){
    return this.http.post(env.apiurl + 'logout', '', this.getHeader());
  }

  //add vaccine from chart

  addVaccine(data:any){
    return this.http.post(env.apiurl + 'add-vaccine', data, this.getHeader() );
  }

  //add vaccine form dashboard
  addVaccineFromDashboard(data:any){
    return this.http.post(env.apiurl + 'store-vaccine-records', data, this.getHeader() );
  }

  // add member
  addMember(data:any = []){
    return this.http.post(env.apiurl + 'member/store', data, this.getHeader() );
  }

  // update member
  updateMember(data:any = [],mid:any){
    return this.http.post(env.apiurl + 'member/update/' + mid, data, this.getHeader() );
  }

  // delete member
  deleteMember(id:any){
    return this.http.delete(env.apiurl + 'member/delete/' + id, this.getHeader() );
  }

  // send otp on email
  sendEmailOtp(formData:any){
    return this.http.post<any>(env.apiurl + 'send-otp', formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    });
  }
  // verfiy email's otp
  verifyOtp(formData:any){
    return this.http.post<any>(env.apiurl + 'verify-otp', formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    });
  }
  ngOnInit(): void {
  }

}
