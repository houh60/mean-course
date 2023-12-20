import { Component } from '@angular/core';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  posts: Post[] = [];
  onPostAdded(event: any) {
    console.log("event: ", event);
    this.posts.push(event);
  }

}
