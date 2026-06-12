import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view-post',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-post.component.html',
  styleUrl: './view-post.component.css'
})
export class ViewPostComponent implements OnInit {
  post: Post | null = null;
  postId: number | null = null;
  showDeleteModal: boolean = false;
  isDeleting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.postId = +idParam;
        this.loadPost(this.postId);
      }
    });
  }

  loadPost(id: number): void {
    this.postService.getPostById(id).subscribe({
      next: (data) => {
        this.post = data;
      },
      error: (err) => {
        console.error('Error fetching post:', err);
      }
    });
  }

  getUserName(): string | null {
    return this.authService.getUserName();
  }

  editPost(): void {
    if (this.postId) {
      this.router.navigate(['/edit-post', this.postId]);
    }
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }
 
  closeDeleteModal(): void {
    if (!this.isDeleting) {
      this.showDeleteModal = false;
    }
  }
 
  confirmDelete(): void {
    if (!this.postId || this.isDeleting) return;
 
    this.isDeleting = true;
    this.postService.deletePost(this.postId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.router.navigate(['/my-post']);
      },
      error: (err) => {
        console.error('Error deleting post:', err);
        this.isDeleting = false;
      }
    });
  }
}
