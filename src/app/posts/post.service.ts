import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  postsUpdated = new Subject();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{ message: string, posts: Post[]; }>('http://localhost:3000/api/posts').subscribe(res => {
      console.log("res: ", res);
      this.posts = res.posts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  addPost(p: Post) {
    const post: Post = {
      id: p.id,
      title: p.title,
      content: p.content
    };
    this.http.post<{ message: string; }>('http://localhost:3000/api/posts', post).subscribe(responseData => {
      console.log("responseData.message: ", responseData.message);
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }
}
