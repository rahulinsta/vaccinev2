import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartComponent } from './chart/chart.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { MembersListComponent } from './dashboard/members-list/members-list.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  {path: '', component: SignupComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'login' , component: LoginComponent},
  {path: 'dashboard' , component: DashboardComponent},
  {path: 'chart' , component: ChartComponent},
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'dashboard/members-list', component: MembersListComponent },
  { path: 'dashboard/notifications', component: NotificationsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
