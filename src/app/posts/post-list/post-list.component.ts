import { Component, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  subsciption = new Subscription();

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPosts();
    this.subsciption = this.postService.postsUpdated.subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  onEdit() {}

  onDelete() {}

  ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }
}
