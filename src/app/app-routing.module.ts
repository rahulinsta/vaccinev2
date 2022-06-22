import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartComponent } from './chart/chart.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';

const routes: Routes = [
  {path: '', component: SignupComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'login' , component: LoginComponent},
  {path: 'dashboard' , component: DashboardComponent},
  {path: 'chart' , component: ChartComponent},
  { path: 'verify-otp', component: VerifyOtpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
