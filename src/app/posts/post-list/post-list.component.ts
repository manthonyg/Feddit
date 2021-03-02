import { Component, OnInit, Inject } from '@angular/core';
import { PostService } from "../../services/post.service";
import { Post } from "../models/post.model";
import { MessagerService } from "../../services/messager.service";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  constructor(
    private postService: PostService, 
    private messagerService: MessagerService,
    private route: ActivatedRoute,
    private router: Router) { }

  public isPostsLoading: boolean = false;
  public postList: Post[];
  public panelOpenState: boolean = false;

  // Paginator
  public length: number = 3;
  public pageSize: number = 1;
  public page: number = 1;
  public totalPosts = 0;
  public pageSizeOptions: number[] = [1, 2, 5];
  
  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.pageSize = params['pagesize']
      this.page = params['page']
    });

    this.isPostsLoading = true;
    this.postService.postSource$.subscribe((postData) => {
      this.postList = postData;
      this.totalPosts = postData.length;
      this.isPostsLoading = false;
    });

    this.postService.fetchPosts(this.pageSize, this.page)

    this.checkMessages()
  }


  public handleDelete(post: Post): void {
      this.postService.deletePost(post)
      .subscribe(
        response => {
          this.messagerService.createMessage({type: "Success", content: `Deleted ${post.title}`, duration: 5000})
        }, 
        error => {
          this.messagerService.createMessage({type: "Error", content: `Could not delete post`, duration: 5000})
      });
    }

  public handlePage(pageData): void {
    this.page = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.postService.fetchPosts(this.pageSize, this.page);
    const queryParams: Params = { page: this.page, pagesize: this.pageSize };
    
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: queryParams, 
      });
    }

  public checkMessages(): void {
    const currentMessage = this.messagerService.getMessage()
    if (currentMessage.content !== null) {
      this.messagerService.openSnackBar()
    }
  }
}
