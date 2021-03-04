import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Post } from "../models/post.model";
import { PostService } from "../../services/post.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute, RouterLink, ParamMap } from "@angular/router";
import { MessagerService } from 'src/app/services/messager.service';
import { Message } from "../../models/message.model";
import { mimeType } from "../../validators/mime-type.validator";
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, AfterViewInit {
  public post: Post = {_id: '', message: '', title: '', imagePath: ''};
  public mode: string = 'create';
  private _postId: string;
  public isLoading: boolean = false;
  public form: FormGroup;
  public imagePreview: string | ArrayBuffer = '';

  @ViewChild('imageInput') imageInput;
  @ViewChild('formRef') formRef;


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
      image: new FormControl(null, {
        validators: [mimeType],
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if (paramMap.has('postId')) {
        this.mode = 'edit'
        this._postId = paramMap.get('postId')
        this.postService.getPost(this._postId)

        .subscribe(postData => {
          console.log('found post!', postData)
          this.post = {
            _id: postData._id,
            title: postData.title,
            message: postData.message,
            imagePath: postData.imagePath
        };
        this.form.setValue(
          {
            title: postData.title,
            message: postData.message,
            image: postData.imagePath 
          });
      });

      }


      else {
        this.mode = 'create'
      }


    });
  }

  ngAfterViewInit(): void {
    this.formRef.nativeElement.focus();
  };

  public handleSubmitPost(): void {
    
    let alertMessage: Message;

    if (this.form.invalid) {
      alertMessage = {content: "Failed to post", type: "Error", duration: 3000}
      return this.messagerService.createMessage(alertMessage)
    }

    else if (this.form.valid) {

      if (this.mode === 'create') {

        this.postService.addPost(
          this.form.value.title, 
          this.form.value.message, 
          this.form.value.image
        );

        alertMessage = {content: 'Post created', type: 'Success', duration: 3000}
      };
    };

    if (this.mode === 'edit') {

      this.postService.updatePost(
        this.post._id, 
        this.form.value.title, 
        this.form.value.message, 
        this.form.value.image
      );

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
    this.form.patchValue({'image': file})
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file)
  }
}
