import { Component, OnInit } from '@angular/core';
import { AtApiService } from 'anontown';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  templateUrl: './tags.page.component.html',
  styleUrls: ['./tags.page.component.scss']
})
export class TagsPageComponent implements OnInit {

  constructor(private api: AtApiService,
    public snackBar: MdSnackBar,
    private router: Router) { }

  tags: { name: string, count: number }[];

  async ngOnInit() {
    document.title = "タグ一覧";
    try {
      this.tags = await this.api.findTopicTags({ limit: 100 });
    } catch (_e) {
      this.snackBar.open("タグ一覧取得に失敗")
    }
  }

  click(name: string) {
    this.router.navigate(['/topic/search'], { queryParams: { tags: name } });
  }

}