import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  postsUpdated = new Subject();

  baseUrl = 'http://localhost:3000/api/posts/';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getPosts() {
    this.http.get<{ message: string, posts: any; }>(this.baseUrl)
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            date: post.date
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string, content: string, date: string; }>(this.baseUrl + id);
  }

  addPost(p: Post) {
    const post: Post = {
      id: p.id,
      title: p.title,
      content: p.content,
      date: p.date
    };
    this.http.post<{ message: string, postId: string; }>(this.baseUrl, post).subscribe(responseData => {
      post.id = responseData.postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string) {
    const post = { id: id, title: title, content: content, date: null };
    this.http.put(this.baseUrl + id, post).subscribe(responseData => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id == post.id);
      const oldPost = updatedPosts[oldPostIndex];
      post.date = oldPost.date;
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    this.http.delete<{ message: string; }>(this.baseUrl + postId).subscribe((responseData) => {
      this.posts = this.posts.filter(post => post.id != postId);
      this.postsUpdated.next([...this.posts]);
    });
  }
}
