import { Component } from '@angular/core';
import { Router,NavigationEnd} from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  roomIdInput:String = "";
  userId: String = this.generateRandomId();


  constructor(private router:Router)
  {this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe(()=>{});
  
  }

  login(){
    if(this.roomIdInput.trim()!= "")
    {
      this.router.navigate(["chat",this.roomIdInput.trim(),this.userId]);
    }
  }

  private generateRandomId():String{
    const randomId = Math.random().toString(36).substring(2,10);
    return randomId;
  }

}
