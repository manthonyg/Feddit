import { BehaviorSubject, Subject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
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

    const postData = new FormData();
      postData.append('title', post.title);
      postData.append('message', post.message);
      postData.append('imagePath', post.imagePath);

    this._http.post<Post>(`${this.LOCALPATH}/api/posts`, postData)
    .subscribe((post) => {
      console.log('new post inside services', post)
      const newPost: Post = {
        _id: post._id,
        ...post
      }
      const newPosts = [...this.getPosts(), newPost]
      this._setPosts(newPosts)
    });
  }

  public deletePost(post: Post): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
      ...post 
      },
    };

      return this._http.delete(`${this.LOCALPATH}/api/posts`, options)
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