import { Component, OnInit } from '@angular/core';
import { PostService } from "../../services/post.service";
import { Post } from "../models/post.model";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  constructor(private postService: PostService) { }

  public postList: Post[];
  public panelOpenState: boolean = false;

  ngOnInit(): void {
    this.postService.postSource$.subscribe((postList) => {
      this.postList = postList
    })

    this.postService.fetchPosts()
  }

  public handleDelete(post: Post): void {
    this.postService.deletePost(post)
  }
  

}
