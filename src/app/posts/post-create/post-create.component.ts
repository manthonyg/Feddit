import { Component, OnInit } from '@angular/core';
import { Post } from "../models/post.model";
import { PostService } from "../../services/post.service";
import { NgForm } from "@angular/forms";
import { Router, RouterModule, ActivatedRoute, RouterLink, ParamMap } from "@angular/router";
import { MessagerService } from 'src/app/services/messager.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef} from '@angular/material/snack-bar';
import { Message } from "../../models/message.model";
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  public post: Post = {_id: '', message: '', title: ''};
  public mode: string = 'create';
  private _postId: string;

  constructor(
    private postService: PostService, 
    private router: Router, 
    private messagerService: MessagerService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit'
        this._postId = paramMap.get('postId')
        this.postService.getPost(this._postId)
        .subscribe(postData => {
          this.post = {
            _id: postData._id,
            title: postData.title,
            message: postData.message 
        }
      });
      }
      else {
        this.mode = 'create'
      }
    });
  }

  public handleSubmitPost(form: NgForm): void {

    let alertMessage: Message;
    if (form.invalid) {
      this.messagerService.createMessage({content: 'Failed to post', type: 'Error', duration: 3000})
    }
    if (form.valid) {
      if (this.mode === 'create') {
        this.postService.addPost(
          {
          _id: null,
          title: form.value.title,
          message: form.value.message,
        }
      );
      alertMessage = {content: 'Post created', type: 'Success', duration: 3000}
    }

    if (this.mode === 'edit') {
      const updatedPost = {
        _id: this.post._id,
        title: form.value.title,
        message: form.value.message
      };
      this.postService.updatePost(this.post._id, updatedPost)
      alertMessage = {content: 'Post updated', type: 'Success', duration: 3000}
    } 
      this.messagerService.createMessage(alertMessage)
      this.router.navigate(['/'])
  }
}

// public handleEditPost(form: NgForm): void {
//   if (form.valid) {
//     this.postService.updatePost(form.value._id)
//     form.resetForm();
//   }
//   }
}
