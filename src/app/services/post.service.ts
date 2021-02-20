import { BehaviorSubject, Subject } from "rxjs";
import { Injectable, ɵcompileNgModuleFactory__POST_R3__ } from "@angular/core";
import { Post } from "../posts/models/post.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
@Injectable({providedIn: 'root'})
export class PostService {


  constructor(private _http: HttpClient) { }
  
  LOCALPATH = "http://localhost:3000"
  private readonly _postSource = new BehaviorSubject<Post[]>([])
  readonly postSource$ = this._postSource.asObservable()

  public fetchPosts() {
    this._http
    .get<Post[]>(`${this.LOCALPATH}/api/posts`)
    .subscribe((postData) => {
      this._postSource.next(postData)
    })
  }

  public getPosts(): Post[] {
    return this._postSource.getValue()
  }

  private _setPosts(posts: Post[]): void {
    return this._postSource.next(posts)
  }

  public addPost(post: Post): void {
    const newPost: Post = {_id: null, title: post.title, message: post.message}
    this._http.post<Post>(`${this.LOCALPATH}/api/posts`, post)
    .subscribe((post) => {
      newPost._id = post._id
      const newPosts = [...this.getPosts(), newPost]
      this._setPosts(newPosts)
    })
  }

  public deletePost(post: Post): void {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
      ...post 
      },
    };

    this._http.delete(`${this.LOCALPATH}/api/posts`, options)
    .subscribe(() => {
      this.fetchPosts();
    });
  }

  public getPost(postId: string) {
    return this._http.get<Post>(`${this.LOCALPATH}/api/posts/${postId}`)
  }

  public updatePost(postId: string, updatedPost: Post) {
      console.log('post', updatedPost)
      this._http
      .put(`${this.LOCALPATH}/api/posts/${postId}`, updatedPost)
     .subscribe((updatedPost) => {
        console.log({updatedPost})
      });
    }
}