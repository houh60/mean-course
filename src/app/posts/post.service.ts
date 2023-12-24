import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [
    { title: 'dfd', content: 'dfdfdaeefd' }
  ];
  postsUpdated = new Subject();

  getPosts() {
    return [...this.posts];
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
