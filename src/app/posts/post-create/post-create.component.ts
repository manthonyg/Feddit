import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { Post } from "../models/post.model";
import { PostService } from "../../services/post.service";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, RouterModule, ActivatedRoute, RouterLink, ParamMap } from "@angular/router";
import { MessagerService } from 'src/app/services/messager.service';
import { Message } from "../../models/message.model";
import { mimeType } from "../../validators/mime-type.validator";
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  public post: Post = {_id: '', message: '', title: '', imagePath: ''};
  public mode: string = 'create';
  private _postId: string;
  public isLoading: boolean = false;
  public form: FormGroup;
  public imagePreview: string | ArrayBuffer = '';

  @ViewChild('imageInput') imageInput;

  constructor(
    private postService: PostService, 
    private router: Router, 
    private messagerService: MessagerService,
    private route: ActivatedRoute) { }
   

  ngOnInit(): void {
    //TODO make this into a switch case and clean it up

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      message: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(255)]
      }),
      imagePath: new FormControl(null, {
        validators: [Validators.required, mimeType(this.imagePreview)],
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit'
        this._postId = paramMap.get('postId')
        this.postService.getPost(this._postId)
        .subscribe(postData => {
          this.post = {
            _id: postData._id,
            title: postData.title,
            message: postData.message,
            imagePath: postData.imagePath
        }
      });
        this.form.setValue(
          {
            title: this.post.title, 
            message: this.post.message
          });
      }
      else {
        this.mode = 'create'
      }
    });
  }

  public handleSubmitPost(): void {
    
    let alertMessage: Message;

    if (this.form.invalid) {
      this.messagerService.createMessage({content: 'Failed to post', type: 'Error', duration: 3000})
      return
    }

    if (this.form.valid) {

      if (this.mode === 'create') {
        this.postService.addPost(
          {
          _id: null,
          title: this.form.value.title,
          message: this.form.value.message,
          imagePath: this.form.value.imagePath
        }
      );
      alertMessage = {content: 'Post created', type: 'Success', duration: 3000}
    }
    this.form.reset();
  }

    if (this.mode === 'edit') {
      const updatedPost = {
        _id: this.post._id,
        title: this.form.value.title,
        message: this.form.value.message,
        imagePath: this.form.value.imagePath
      };
      this.postService.updatePost(this.post._id, updatedPost)
      alertMessage = {content: 'Post updated', type: 'Success', duration: 3000}
    } 
      this.messagerService.createMessage(alertMessage)
      this.router.navigate(['/'])
      this.form.reset()
  }


  public openImageSelect() {
    this.imageInput.nativeElement.click()
  }

  public handleImageSelect() {
    const file = this.imageInput.nativeElement.files[0]
    this.form.patchValue({'imagePath': file})
    this.form.get('imagePath').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file)
  }
}
