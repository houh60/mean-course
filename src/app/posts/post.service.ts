import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject();

  getPosts() {
    return [...this.posts];
  }

  getUpdatedPost() {
    return this.postsUpdated.asObservable();
  }

  addPost(p: Post) {
    const post: Post = {
      title: p.title,
      content: p.content
    };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
