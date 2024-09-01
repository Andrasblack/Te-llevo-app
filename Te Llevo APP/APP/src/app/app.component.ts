import { Component } from '@angular/core';
import { Page } from './interfaces/page';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: Page[] = [];
  public tipoUsuario?: string;
  public emailUsuario?: string;

  constructor(private router: Router) {}

  ngOnInit() {
    const usuario = localStorage.getItem('usuarioLogin');

    if (usuario) {
      const aux = JSON.parse(usuario);
      this.tipoUsuario = aux.tipo;
      this.emailUsuario = aux.email;
      this.configSideMenu();
    } else {
      this.router.navigate(['/login']);
    }
  }

  configSideMenu() {
    if ( this.tipoUsuario === 'admin' ) {
      this.appPages = [
        { title: 'Dashboard', url: '/admin-dashboard', icon: 'home' },
        { title: 'Administrar Usuarios', url: '/admin-users', icon: 'people' },
        { title: 'Cerrar Sesión', url: '/login', icon: 'log-out' },
      ]
    } else if ( this.tipoUsuario === 'usuario') {
      this.appPages = [
        { title: 'Dashboard', url: '/usuario-dashboard', icon: 'home' },
        { title: 'Perfil', url: '/perfil', icon: 'settings' },
        { title: 'Cerrar Sesión', url: '/login', icon: 'log-out' },
      ]
    } else {
      this.appPages = [
        { title: 'Login', url: '', icon: '' },
        { title: 'Registrarme', url: '', icon: '' },
      ]
    }
  }
}
