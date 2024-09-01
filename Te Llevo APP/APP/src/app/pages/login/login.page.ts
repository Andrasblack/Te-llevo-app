import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  emailValue?: string;
  passValue?: string;

  private usuarios = [
    { 'email':'admin@admin.cl','pass':'admin123','tipo':'admin'},
    { 'email':'user@user.cl','pass':'user123','tipo':'usuario'},
    { 'email':'invi@invi.cl','pass':'invitado','tipo':'invitado'},
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder, 
    private toastController: ToastController, 
    private loadingController: LoadingController
  ) {
    this.loginForm = this.formBuilder.group({
      email : ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  async login() {
    if (this.loginForm.invalid) {
      const errorMessages = this.getErrorMessages();
      for (const message of errorMessages) {
        this.showErrorToast(message);
      }
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Cargando.....',
      duration: 2000
    });

    const email = this.emailValue;
    const pass = this.passValue;

    // BUSCAMOS AL USUARIO EN LA BD
    const user = this.usuarios.find(aux => aux.email === email && aux.pass === pass);

    if (user) {
      await loading.present();
      localStorage.setItem('usuarioLogin', JSON.stringify(user));

      setTimeout(async() => {
        await loading.dismiss();
        if (user.tipo === 'admin') {
          this.router.navigate(['/administrador']);
        } else if (user.tipo === 'usuario') {
          this.router.navigate(['/usuario']);
        } else {
          this.router.navigate(['/invitado']);
        }
      }, 2000);
      
    } else {
      this.showErrorToast('Usuario o contraseña incorrecta.');
    }
  }

  getErrorMessages(): string[] {
    const messages: string[] = [];
    if (this.loginForm.get('email')?.hasError('required')) {
      messages.push('El correo es requerido!');
    } else if (this.loginForm.get('email')?.hasError('email')) {
      messages.push('El correo es inválido!');
    }
    if (this.loginForm.get('pass')?.hasError('required')) {
      messages.push('La contraseña es requerida!');
    } else if (this.loginForm.get('pass')?.hasError('minlength')) {
      messages.push('La contraseña tiene como mínimo 6 caracteres!');
    }
    return messages;
  }

  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'light'
    });
    await toast.present();
  }
}