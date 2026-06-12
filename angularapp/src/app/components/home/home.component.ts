import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Post[] = [];
  defaultCategories: string[] = ['Technology', 'Health', 'Travel', 'Education', 'Food'];
  categories: string[] = ['All', ...this.defaultCategories];
  searchTerm: string = '';
  selectedCategory: string = 'All';

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getAllPosts().subscribe(posts => {
      this.posts = posts.map(post => ({
        ...post,
        createdAt: new Date(post.createdAt)
      }));

      this.categories = [
        'All',
        ...Array.from(
          new Set([
            ...this.defaultCategories,
            ...this.posts.map((post) => post.cat).filter(Boolean)
          ])
        )
      ];
    });
  }

  filteredPosts(): Post[] {
    const keyword = this.searchTerm.trim().toLowerCase();
    return this.posts.filter((post) => {
      const matchesCategory =
        this.selectedCategory === 'All' || post.cat === this.selectedCategory;
      const matchesKeyword =
        !keyword ||
        post.title?.toLowerCase().includes(keyword) ||
        (post.content || '').toLowerCase().includes(keyword);
      return matchesCategory && matchesKeyword;
    });
  }

  getExcerpt(html: string): string {
    if (!html) return '';

    const temp = document.createElement('div');
    temp.innerHTML = html;

    const text = temp.textContent || temp.innerText || '';

    return text.length > 120 ? text.substring(0, 120) + '...' : text;
  }
}