import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  user: string | null = '';
  categories: string[] = ['Technology', 'Health', 'Travel', 'Education', 'Food'];
  mobileMenuOpen: boolean = false;

  constructor(public readonly router: Router) { }


  ngOnInit(): void {
    this.user = localStorage.getItem('userName');
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}

