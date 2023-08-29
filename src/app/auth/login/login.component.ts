import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted = false;
  loginForm: FormGroup;
  public auth2: any;
  constructor(private router: Router,
              private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private ngZone: NgZone
    ) { 
      this.loginForm = this.fb.group({    
        email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        remember: [false]
      }
      )
    }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit(){
    console.log( { algo: this });
    
    google.accounts.id.initialize({
      client_id: "1082892649100-ffhpvn13dqb0evib9rs31k1b5c5oi0ed.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,

      { theme: "outline", size: "large" }  // customization attributes
    );
  }


  handleCredentialResponse(response: any){    
    console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle( response.credential)
          .subscribe(
          {
              next: resp =>{                
                this.router.navigateByUrl('/');
              }, error: (err) =>{
                console.log(err);
                
              }
            })
  }

  login(){
  
    this.usuarioService.login( this.loginForm.value )
        .subscribe(
        {
          next: resp =>{            
            console.log(resp);            
            if(this.loginForm.get('remember')?.value){
              localStorage.setItem('email', this.loginForm.get('email')?.value);
            } else {              
              localStorage.removeItem('email');
            }            
            // navegar al Dashboard
            this.ngZone.run(() =>{
              this.router.navigateByUrl('/');
            });
            

          }, error:(err) =>{
            // Si suceden un error
            Swal.fire('Error', err.error.msg, 'error');
          }

        }          
      );
    }
}
