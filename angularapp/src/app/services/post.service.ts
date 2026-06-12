import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { API_BASE_URL } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private readonly http: HttpClient) { }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(API_BASE_URL+'/posts');
  }

  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(API_BASE_URL+'/posts', post);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(API_BASE_URL+`/posts/${id}`);
  }

  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(API_BASE_URL+`/posts/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(API_BASE_URL+`/posts/${id}`);
  }

  checkContent(body: { content: string }): Observable<{ hasOffensiveContent: boolean; flaggedCategories: string[] }> {
    return this.http.post<{ hasOffensiveContent: boolean; flaggedCategories: string[] }>(
      API_BASE_URL + '/posts/check', body
    );
  }
}
