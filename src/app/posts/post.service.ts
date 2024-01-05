import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
            date: post.date,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string, content: string, date: string, imagePath: string; }>(this.baseUrl + id);
  }

  addPost(p: Post, image: File) {
    const postData = new FormData();
    postData.append('title', p.title);
    postData.append('content', p.content);
    postData.append('date', p.date);
    postData.append('image', image, p.title);

    this.http.post<{ message: string, post: Post; }>(this.baseUrl, postData)
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.post.id,
          title: p.title,
          content: p.content,
          date: p.date,
          imagePath: responseData.post.imagePath
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, date: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id: id, title: title, content: content, date: date, imagePath: image };
    }

    const headers = this.setHeaders(id);

    this.http.put(this.baseUrl + id, postData, { headers }).subscribe(responseData => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id == id);
      const oldPost = updatedPosts[oldPostIndex];
      const post = { id: id, title: title, content: content, date: date, imagePath: (postData as Post).imagePath };
      post.date = oldPost.date;
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    const headers = this.setHeaders(postId);
    this.http.delete<{ message: string; }>(this.baseUrl + postId, { headers }).subscribe((responseData) => {
      this.posts = this.posts.filter(post => post.id != postId);
      this.postsUpdated.next([...this.posts]);
    });
  }

  setHeaders(id: string) {
    let postToDelete = this.posts.find(post => post.id == id);
    let path = '';
    if (postToDelete) {
      path = postToDelete.imagePath;
      let start = path.indexOf('images');
      path = 'backend/' + path.substring(start);
    }
    return new HttpHeaders().set('path', path as string);
  }
}
