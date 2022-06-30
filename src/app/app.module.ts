import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
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
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { MembersListComponent } from './dashboard/members-list/members-list.component'; 
import {DatePipe} from '@angular/common';
import { QRCodeModule } from 'angular2-qrcode';
import { PageLoaderComponent } from './elements/page-loader/page-loader.component';
import { ConfirmDeleteComponent } from './elements/confirm-delete/confirm-delete.component';


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
    ConfirmDeleteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgOtpInputModule,
    QRCodeModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
