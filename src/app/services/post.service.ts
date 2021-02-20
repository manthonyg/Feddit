import { BehaviorSubject, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { Post } from "../posts/models/post.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class PostService {


  constructor(private _http: HttpClient) { }
  
  LOCALPATH = "http://localhost:3000"
  private readonly _postSource = new BehaviorSubject<Post[]>([])
  readonly postSource$ = this._postSource.asObservable()

  public fetchPosts() {
    this._http.get<Post[]>(`${this.LOCALPATH}/api/posts`)
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
    // optimistic updating vs not optimisitc updating
    this._http.post<Post>(`${this.LOCALPATH}/api/posts`, post)
    .subscribe((post) => {
      const newPosts = [...this.getPosts(), post]
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
    .subscribe((post) => {
      this.fetchPosts();
    });
  }


}