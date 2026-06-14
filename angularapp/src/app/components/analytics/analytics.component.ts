import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements OnInit {
  postId: string = '';
  viewCount = 0;

  constructor(
    private route: ActivatedRoute,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id') ?? '';

    // Fetch and display the current view count
    this.analyticsService.getViewCount(this.postId).subscribe((res) => {
      this.viewCount = res.views;
    });
  }
}