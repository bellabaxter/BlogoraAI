// analytics.service.ts
// Place this file in: angularapp/src/app/services/analytics.service.ts
//
// This service talks to the Go analytics microservice.
// Inject it into any component that displays or opens a blog post.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface ViewCountResponse {
  postId: string;
  views: number;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  // Change this if your Go service runs on a different host/port
  private readonly analyticsBaseUrl = 'http://localhost:8081/analytics';

  constructor(private http: HttpClient) {}

  /**
   * Call this when a user OPENS a post.
   * It sends POST /analytics/view/{postId} to the Go service,
   * which increments the view count in Redis by 1.
   *
   * Example:
   *   ngOnInit() { this.analyticsService.recordView(this.postId).subscribe(); }
   */
  recordView(postId:string | number): Observable<ViewCountResponse> {
    return this.http
      .post<ViewCountResponse>(`${this.analyticsBaseUrl}/view/${postId}`, {})
      .pipe(
        catchError((err) => {
          // Analytics should never crash the main app — fail silently
          console.warn('Analytics recordView failed:', err);
          return of({ postId: String(postId), views: 0 });
        })
      );
  }

  /**
   * Call this to DISPLAY the view count on a post card or detail page.
   * Sends GET /analytics/count/{postId} and returns the current total.
   *
   * Example:
   *   this.analyticsService.getViewCount(post.id).subscribe(res => {
   *     this.viewCount = res.views;
   *   });
   */
  getViewCount(postId: string | number): Observable<ViewCountResponse> {
    return this.http
      .get<ViewCountResponse>(`${this.analyticsBaseUrl}/count/${postId}`)
      .pipe(
        catchError((err) => {
          console.warn('Analytics getViewCount failed:', err);
          return of({ postId: String(postId), views: 0 });
        })
      );
  }
}
