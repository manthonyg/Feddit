import { Component, OnInit, Inject } from '@angular/core';
import { PostService } from "../../services/post.service";
import { Post } from "../models/post.model";
import { MessagerService } from "../../services/messager.service";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  constructor(
    private postService: PostService, 
    private messagerService: MessagerService) { }

  public isPostsLoading: boolean = false;
  public postList: Post[];
  public panelOpenState: boolean = false;
  
  ngOnInit(): void {
    this.isPostsLoading = true;
    this.postService.postSource$.subscribe((postList) => {
      this.postList = postList
      this.isPostsLoading = false;
  
    })

    this.postService.fetchPosts()

    this.checkMessages()
  }

  public handleDelete(post: Post): void {
      this.postService.deletePost(post)
      .subscribe(
        response => {
          this.messagerService.createMessage({type: "Success", content: `Deleted ${post.title}`, duration: 5000})
          this.postService.fetchPosts()
        }, 
        error => {
          this.messagerService.createMessage({type: "Error", content: `Could not delete post`, duration: 5000})
      });
    }


  public checkMessages(): void {
    const currentMessage = this.messagerService.getMessage()
    if (currentMessage.content !== null) {
      this.messagerService.openSnackBar()
    }
  }



}
