import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component'; // Import your register component
import { ChatsComponent } from './chats/chats.component';
import { VerificationComponent } from './pages/verification/verification.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path:'chat',component: ChatsComponent},
 {path:'verification',component: VerificationComponent},
  { path: 'register', component: RegisterComponent }, // Define route for register component
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/login' }, // Redirect any unknown routes to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
