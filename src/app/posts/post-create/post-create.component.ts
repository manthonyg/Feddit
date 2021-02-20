import { Component, OnInit } from '@angular/core';
import { Post } from "../models/post.model";
import { PostService } from "../../services/post.service";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { MessagerService } from 'src/app/services/messager.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  public post: Post = {_id: '', message: '', title: ''};

  constructor(
    private postService: PostService, 
    private router: Router, 
    private messagerService: MessagerService) { }

  ngOnInit(): void {
  }

  public handleSubmitPost(form: NgForm): void {
    console.log(form.value)
    if (form.valid) {
    this.postService.addPost(
      {
        _id: null,
        title: form.value.title,
        message: form.value.message,
      }
    );
    form.resetForm()
  }
  const message = {content: 'Message posted', type: 'Success', duration: 3000}
  this.messagerService.createMessage(message)
  this.router.navigate(['/'])
}

}
