import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from "./password-validator.component";
import { LayoutService } from 'src/app/services/layout.service';
import { User } from 'src/app/models/user.model';
import swal from "sweetalert2";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  focus;
  focus1;
  focus2;
  focus3;
  focus4;
  
  public focusTouched;
  public focusTouched1;
  public focusTouched2;
  public focusTouched3;
  public focusTouched4;

  public registerForm: FormGroup;
  public register = false;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private _LayoutService: LayoutService
  ) {}

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("register-page");
    
    this.registerForm = this.formBuilder.group(
      {
        firstName: ["", [Validators.required]],
        lastName: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        repeatPassword: ["", [Validators.required, Validators.minLength(6)]]
      },
      {
        validator: MustMatch("password", "repeatPassword")
      }
    );
  }
  
  get f() {
    return this.registerForm.controls;
  }

  
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("register-page");
  }

  onSubmit(){
    if(this.registerForm.invalid) return;
    const user = new User(this.registerForm.value.email, this.registerForm.value.password, this.registerForm.value.firstName, this.registerForm.value.lastName);
    this._LayoutService.Register(user).subscribe(
      (data:any) => {

        if(data.success){
          swal.fire({
            html: `<span style='color:grey'> ${data.msg} <span>`,
            buttonsStyling: false,
            confirmButtonClass: "btn btn-danger btn-simple",
            background: '#ffffff'
          });
          
          this.router.navigate([`/login`]);

        }

      }, (error: any) => {
        console.error(error);
        if(!!error.error.msg){
          swal.fire({
            html: `<span style='color:grey'> ${error.error.msg} <span>`,
            buttonsStyling: false,
            confirmButtonClass: "btn btn-danger btn-simple",
            background: '#ffffff'
          });
        }

        if(!!error.error.errors){
          if(error.error.errors.length > 0){
            swal.fire({
              html: `<span style='color:grey'> ${error.error.errors} <span>`,
              buttonsStyling: false,
              confirmButtonClass: "btn btn-danger btn-simple",
              background: '#ffffff'
            });
          }
        }
      });
  }
}
