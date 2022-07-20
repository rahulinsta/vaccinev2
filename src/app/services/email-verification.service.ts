import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EmailVerificationService {

  constructor(private http: HttpClient) { }
  isEmailVerify(){
    const userData = JSON.parse(localStorage.getItem('checkUser') || '{}');
    // console.log(userData?.isEMailVerified);
    if(userData?.isEMailVerified){
      return false;
    } else{
      return true;
    }
  }
  getEmail(){
    const userData = JSON.parse(localStorage.getItem('checkUser') || '{}');
    if(userData){
      return userData?.emailAddress || '';
    } else{
      return '';
    }
  }

  getToken() {
    if (!!localStorage.getItem("vctoken")) {
      return localStorage.getItem("vctoken")
    } else {
      return false;
    }
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

  resendActLink(formData:any){
    return this.http.post(env.apiurl + 'resent-email', formData, this.getHeader() );
  }
}
