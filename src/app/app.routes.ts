import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';


export const routes: Routes = [   
  { path: 'chat/:roomId/:userId', component: ChatComponent },
  { path: 'login', component: LoginComponent }, // Corrección aquí
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
