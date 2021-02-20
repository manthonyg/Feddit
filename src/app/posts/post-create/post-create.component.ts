import { Component, OnInit } from '@angular/core';
import { Post } from "../models/post.model";
import { PostService } from "../../services/post.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  public post: Post = {_id: '', message: '', title: ''};

  constructor(private postService: PostService) { }

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
}

}
