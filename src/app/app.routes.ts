import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: 'chat/:roomId/:userId', redirectTo: 'chat/:roomId', pathMatch: 'full' },
  { path: 'chat/:roomId', component: ChatComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
