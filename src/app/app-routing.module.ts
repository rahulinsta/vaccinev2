import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartComponent } from './chart/chart.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { MembersListComponent } from './dashboard/members-list/members-list.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotComponent } from './forgot-password/forgot/forgot.component';
import { GetOtpComponent } from './forgot-password/get-otp/get-otp.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';

const routes: Routes = [
  {path: '', component: SignupComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'login' , component: LoginComponent},
  {path: 'dashboard' , component: DashboardComponent},
  {path: 'chart' , component: ChartComponent},
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'dashboard/members-list', component: MembersListComponent },
  { path: 'dashboard/notifications', component: NotificationsComponent },
  { path: 'recovery', component: ForgotPasswordComponent, children: [
    {path: 'identify', component: ForgotComponent},
    {path: 'verify', component: GetOtpComponent},
    {path: 'reset', component: ResetPasswordComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
