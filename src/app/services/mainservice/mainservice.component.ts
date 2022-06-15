import {Injectable} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {environment as env} from '../../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI3IiwianRpIjoiMDNjMDYwMmMyOTZlMGQ3ZTdjMjc4ZjM4Mzg4NjhlNDYzZTJjOWUxZGIxYjc0ZWI2NTgwZjYyOGFiMzExZGMwYjZjZjE2M2NhZDkzN2ZlYWMiLCJpYXQiOjE2NTM0NTgzNDMuODg4NzcxMDU3MTI4OTA2MjUsIm5iZiI6MTY1MzQ1ODM0My44ODg3NzM5MTgxNTE4NTU0Njg3NSwiZXhwIjoxNjg0OTk0MzQzLjg4NDE4MTk3NjMxODM1OTM3NSwic3ViIjoiMjAiLCJzY29wZXMiOltdfQ.HGUoW-LDPSOMxOdNXsoZjpeQ6ptWcPTdKsCt39iLnv0kuxtuuQ0kxlL5bzh4vt908qP3j3Nu3Ey9lC9kqDqwJIMDp_Yq70ZNnUZnQBMptgtESUXB1UiNZJSDxWvQy3dg6v02lKHHpRTaEAEXUSEnj5OXB9i-kP6L8xM4EIZybSrxQz51gLUVzr_c6I_YJ996QDteWyOrdsDsD-vSIJmEAriBs13GB5G9wRuZxeC-mZHHLVZX3Sd-vCAdVx7xJJlWb4ShDxCVXLpT9kLRgIUbgVflTlOfQHE2fl9ME1lXpau0s0npZjs4P-k-kRI9VVrdlQfIpwxPOs3w6HpUeK2iN7YlwNhP2tpxYQNjUQ2mVzXBoninTiB21Gw4jgdJH1QQsC4AXhW73wnmZ6YMtsWJbMD4w3awYKtwMXEr7emV90Ix7n7-t2607_hr9pUT8jtmcqKKKR5xvNuUPPV0eGY7M_JVJN_wlrrsrdqIIiwVEOqoyJveJxPKlixv5asuh8pgPqU65w9AGAqwHZ5GDqvXpyIaMHJcv9BDLgHcNywnDMcGKKV3r5mnM5zwHIHPNQWEf8y_FzZ1ggFLHXAUDFmwthYTYxdQD2apPQL-dQTBpxeJK7nririO0-qIiwUvXw0RZaIjRToA_iEA17Bp9MvrjoRPWVUkE0YChkamLuepQgk'
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


  //add vaccine from chart

  addVaccine(data:any){
    return this.http.post(env.apiurl+'add-vaccine',data,httpOptions );
  }



  ngOnInit(): void {
  }

}
