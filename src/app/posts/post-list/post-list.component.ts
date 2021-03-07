import { Component, OnInit } from '@angular/core';
import { PostService } from "../../services/post.service";
import { Post } from "../models/post.model";
import { MessagerService } from "../../services/messager.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Token } from '../../models/token.model';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  constructor(
    private postService: PostService, 
    private messagerService: MessagerService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  public isPostsLoading: boolean = false;
  public postList: Post[];
  public panelOpenState: boolean = false;
  public token: Token;

  // Paginator
  public pageSize: number = 5;
  public page: number = 5;
  public totalPosts = 0;
  public pageSizeOptions: number[] = [5];
  
  ngOnInit(): void {

    this.postService.getPostCount();

    this.route.queryParams.subscribe(params => {
      this.pageSize = params['pagesize']
      this.page = params['page']
    });

    this.isPostsLoading = true;
    this.postService.postSource$.subscribe((postData) => {
      this.postList = postData;
      this.isPostsLoading = false;
    });

    this.postService.postCount$.subscribe((postCount) => {
      this.totalPosts = postCount;
    });

    this.postService.fetchPosts(this.pageSize, this.page)

    this.checkMessages()

    this.userService.tokenSource$.subscribe(token => {
      this.token = token;
    })
  }


  public handleDelete(post: Post): void {
      this.postService.deletePost(post)
      .subscribe(
        response => {
          this.messagerService.createMessage({type: "Success", content: `Deleted ${post.title}`, duration: 5000})
          this.postService.fetchPosts(this.pageSize, this.page);
          this.postService.getPostCount();

        }, 
        error => {
          this.messagerService.createMessage({type: "Error", content: `Could not delete post`, duration: 5000})
      });
    }

  public handlePage(pageData): void {
    this.page = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    // this.numberOfPages = Math.ceil(this.postList.length / this.pageSize);
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
