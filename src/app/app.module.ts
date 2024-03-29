import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MainserviceComponent } from './services/mainservice/mainservice.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartComponent } from './chart/chart.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { MembersListComponent } from './dashboard/members-list/members-list.component';
import { DatePipe } from '@angular/common';
import { QRCodeModule } from 'angular2-qrcode';
import { PageLoaderComponent } from './elements/page-loader/page-loader.component';
import { ConfirmDeleteComponent } from './elements/confirm-delete/confirm-delete.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MessagingService } from '../app/services/messaging.service';
import { environment as env } from 'src/environments/environment';
import firebase from 'firebase';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotComponent } from './forgot-password/forgot/forgot.component';
import { GetOtpComponent } from './forgot-password/get-otp/get-otp.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';
import { AgmCoreModule } from '@agm/core';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmailWarningComponent } from './elements/email-warning/email-warning.component';
import { VerifiedAccountComponent } from './verified-account/verified-account.component';
firebase.initializeApp(env.firebase);
@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    MainserviceComponent,
    DashboardComponent,
    ChartComponent,
    HeaderComponent,
    FooterComponent,
    VerifyOtpComponent,
    MembersListComponent,
    PageLoaderComponent,
    ConfirmDeleteComponent,
    NotificationsComponent,
    ForgotPasswordComponent,
    ForgotComponent,
    GetOtpComponent,
    ResetPasswordComponent,
    EmailWarningComponent,
    VerifiedAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgOtpInputModule,
    QRCodeModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDuYWAPhW9TQvx4SsjrTqK7KFPmJwfOnUQ',
      libraries: ['places']
    }),
    NgxIntlTelInputModule,
    BrowserAnimationsModule
  ],
  providers: [MessagingService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
