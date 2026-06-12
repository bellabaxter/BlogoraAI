import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-post',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-post.component.html',
  styleUrl: './my-post.component.css'
})
export class MyPostComponent implements OnInit {
  user: string | null = null;
  posts: Post[] = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.user = localStorage.getItem('userName');
    this.postService.getAllPosts().subscribe(posts => {
      this.posts = posts.filter(post => post.user && post.user.name === this.user);
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
