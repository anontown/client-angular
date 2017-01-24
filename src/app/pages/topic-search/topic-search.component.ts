import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {
  Topic,
  AtApiService
} from 'anontown';
import {Subject} from 'rxjs';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import * as Immutable from 'immutable';
import {
  UserService,
  BoardService
} from '../../services';

@Component({
  selector: 'app-topic-search',
  templateUrl: './topic-search.component.html',
  styleUrls: ['./topic-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TopicSearchComponent implements OnInit, OnDestroy {
  // 検索結果
  private topics = Immutable.List<Topic>();
  private count = 0;

  // カテゴリの板があれば表示
  private board: Topic = null;

  // 現在の検索条件
  private category = '';
  private title = '';
  private page = 0;
  private dead = false;

  // 設定
  private readonly limit = 100;

  // フォームデータ
  form={
    category:'',
    title:'',
    dead:false
  };

  constructor(private api: AtApiService,
    private route: ActivatedRoute,
    private router: Router,
    private user: UserService,
    private bs: BoardService) {

  }

  // フォーム変更イベント
  formChangeObs=new Subject<void>();

  async update() {
    this.topics = Immutable.List<Topic>();
    this.page = 0;
    this.count = 0;
    await this.more();
  }

  async more() {
    let t = await this.api.findTopic({
      title: this.title,
      category: this.category.length === 0 ? [] : this.category.split('/'),
      skip: this.page * this.limit,
      limit: this.limit,
      activeOnly: !this.dead
    });
    this.count = t.length;
    this.topics = Immutable.List(this.topics.toArray().concat(t));
    this.page++;
  }


  ngOnInit() {
    this.formChangeObs
      .debounceTime(500)
      .subscribe(()=>{
        this.router.navigate(['/topic/search'], { queryParams: { title: this.form.title, category: this.form.category,dead:this.form.dead } });
      });

    this.route.queryParams.forEach(async (params) => {
      this.title = params['title']?params['title']:'';
      this.category = params['category']?params['category']:'';
      this.dead = params['dead']==="true";
      await this.update();

      if (this.bs.topics) {
        let b = this.bs.topics.find(t => t.category.join("/") === this.category);
        if (b) {
          this.board = b;
        } else {
          this.board = null;
        }
      }
    });
  }

  ngOnDestroy() {
  }

  favo() {
    let storage = this.user.ud.storage;
    let bf = storage.boardFavo;
    storage.boardFavo = bf.has(this.category) ? bf.delete(this.category) : bf.add(this.category);
    this.user.updateUserData();
  }

  get isFavo():boolean{
    return this.user.ud.storage.boardFavo.has(this.category);
  }
}