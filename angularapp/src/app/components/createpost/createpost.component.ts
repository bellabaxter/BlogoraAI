import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { RichTextEditorComponent } from '../rich-text-editor/rich-text-editor.component';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GEMINI_API_KEY } from '../../app.constants';

@Component({
  selector: 'app-createpost',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RichTextEditorComponent],
  templateUrl: './createpost.component.html',
  styleUrls: ['./createpost.component.css'],
})
export class CreatepostComponent implements OnInit {
  postForm!: FormGroup;
  postId: number = 0;
  cat: string[] = ['Technology', 'Health', 'Travel', 'Education', 'Food'];
  isUpdateMode: boolean = false;
  errorMessage: string | null = null;
  warningMessage: string | null = null;
  offensiveBypassConfirmed = false;
  selectedFileName: string = '';

  post: Post = {
    title: '',
    content: '',
    cat: '',
    createdAt: new Date(),
    user: {} as User,
    img: '',
  };

  constructor(
    private readonly postService: PostService,
    public readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly ar: ActivatedRoute,
    private readonly http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      cat: ['', Validators.required],
      img: [''],
    });

    this.ar.params.subscribe((params: any) => {
      this.postId = params['id'];
      if (this.postId) {
        this.isUpdateMode = true;
        this.postService.getPostById(this.postId).subscribe((post) => {
          this.postForm.patchValue(post);
        });
      }
    });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.selectedFileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        this.postForm.patchValue({ img: base64Image });
      };
      reader.readAsDataURL(file);
    }
  }

  async checkModerationWithGemini(
    title: string,
    content: string,
  ): Promise<boolean> {
    const apiKey = GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Gemini API key not set. Skipping moderation.');
      return false;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // Strip HTML tags from content for better text analysis
    const cleanContent = content.replace(/<[^>]*>?/gm, '');
    const promptText = `Analyze the following blog post title and content for offensive, inappropriate, or hateful language. Reply only with "YES" if it contains offensive words, or "NO" if it is clean.\n\nTitle: ${title}\nContent: ${cleanContent}`;

    try {
      const response = await firstValueFrom(
        this.http.post<any>(url, {
          contents: [{ parts: [{ text: promptText }] }],
        }),
      );

      const reply =
        response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      return reply === 'YES';
    } catch (error) {
      console.error('Gemini API Error:', error);
      return false; // Fallback to allow upload on error
    }
  }

  async createOrUpdatePost(): Promise<void> {
    this.warningMessage = null;

    if (!this.postForm.valid) {
      return; // Safety guard: don't submit if form is invalid
    }

    const title = this.postForm.get('title')?.value || '';
    const content = this.postForm.get('content')?.value || '';

    if (!this.offensiveBypassConfirmed) {
      const isOffensive = await this.checkModerationWithGemini(title, content);

      if (isOffensive) {
        this.warningMessage =
          'Gemini detected potentially offensive content in your post. Please review it carefully before publishing.';
        return;
      }
    }

    this.warningMessage = null;
    this.offensiveBypassConfirmed = false;
    this.post = this.postForm.value;
    if (this.isUpdateMode) {
      this.postService.updatePost(this.postId, this.post).subscribe(() => {
        this.router.navigate(['/view-post', this.postId]);
      });
    } else {
      this.postService.addPost(this.post).subscribe(() => {
        this.router.navigate(['/my-post']);
      });
    }
  }

  publishAnyway(): Promise<void> {
    this.offensiveBypassConfirmed = true;
    return this.createOrUpdatePost();
  }

  dismissWarning(): void {
    this.warningMessage = null;
    this.offensiveBypassConfirmed = false;
  }

  cancel(): void {
    if (this.isUpdateMode && this.postId) {
      this.router.navigate(['/view-post', this.postId]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
