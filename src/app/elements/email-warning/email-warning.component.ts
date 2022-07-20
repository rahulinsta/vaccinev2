import { Component, OnInit } from '@angular/core';
import { EmailVerificationService } from 'src/app/services/email-verification.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-email-warning',
  templateUrl: './email-warning.component.html',
  styleUrls: ['./email-warning.component.css']
})
export class EmailWarningComponent implements OnInit {

  isEmailVerify: boolean = false;
  isPhoneVerify: boolean = false;
  getEmail: string = '';
  message: any = { status: true, msg: [] };
  constructor(private checkEmail: EmailVerificationService) { }

  ngOnInit(): void {
    this.isEmailVerify = this.checkEmail.isEmailVerify();
    this.getEmail = this.checkEmail.getEmail();
  }


  sendActLink() {
    const formData = {
      "email": this.getEmail
    }
    // console.log(formData);
    this.showModal('popupMsg');
    this.message.msg.push('Sending... Activation link to your email address');
    this.checkEmail.resendActLink(formData).subscribe((res: any) => {
      this.message = { status: true, msg: [] };
      if(res.status){
        this.message.status = true;
        this.message.msg.push('We sent you an activation link. Check your email and click on the link to verify.');
      } else{
        this.message.status = false;
        this.message.msg.push(res.message);       
      }
      setTimeout(() => {
        this.message = { status: true, msg: [] };
        this.closeModal('popupMsg');
      }, 3000);
    }, (err: any) => {
      let errData = err.error.errors;
      for (let key in errData) {
        this.message.msg.push(errData[key][0]);
      }
      if (errData == undefined || errData == null) {
        this.message.msg.push('Something went wrong. Please try later');
      }
      this.message.status = false;
      setTimeout(() => {
        this.closeModal('popupMsg');
      }, 3000);
    });
  }

  showModal(id: any) {
    var closeModalId = document.querySelector(`#${id}`);
    var myModal = bootstrap.Modal.getOrCreateInstance(closeModalId!)
    myModal.show();
  }


  closeModal(id: any) {
    var closeModalId = document.querySelector(`#${id}`);
    var myModal = bootstrap.Modal.getOrCreateInstance(closeModalId!)
    myModal.hide();
  }
}
