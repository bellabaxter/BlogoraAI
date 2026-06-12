import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { CreatepostComponent } from './components/createpost/createpost.component';
import { ViewPostComponent } from './components/view-post/view-post.component';
import { MyPostComponent } from './components/my-post/my-post.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'createpost', component: CreatepostComponent },
  { path: 'edit-post/:id', component: CreatepostComponent },
  { path: 'view-post/:id', component: ViewPostComponent },
  { path: 'my-post', component: MyPostComponent }
];
