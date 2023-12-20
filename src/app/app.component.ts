import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  posts = [];
  onPostAdded(event: any) {
    console.log("event: ", event);
    this.posts.push(event);
  }

}
