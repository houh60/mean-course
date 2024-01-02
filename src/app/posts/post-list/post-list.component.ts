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
  isLoading = false;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts();
    this.subsciption = this.postService.postsUpdated.subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoading = false;
    });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }
}
