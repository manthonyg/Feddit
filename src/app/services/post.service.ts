import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Post } from '../posts/models/post.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private _http: HttpClient, private _router: Router) {}

  public apiURL = environment.apiUrl;

  private readonly _postSource = new BehaviorSubject<Post[]>([]);
  private readonly _postCount = new BehaviorSubject<number>(0);
  private readonly _isPostLoading = new BehaviorSubject<boolean>(false);

  readonly isPostLoading$ = this._isPostLoading.asObservable();
  readonly postCount$ = this._postCount.asObservable();
  readonly postSource$ = this._postSource.asObservable();

  public fetchPosts(pageSize: number, page: number) {
    const queryParams = `?pagesize=${pageSize}&page=${page}`;
    this._http.get<Post[]>(`${this.apiURL}/api/posts/${queryParams}`).subscribe((postData) => {
      this._postSource.next(postData);
    });
  }

  public setPostLoadingStatus(postLoadingStatus: boolean): void {
    this._isPostLoading.next(postLoadingStatus);
  }

  public getPosts(): Post[] {
    return this._postSource.getValue();
  }

  public getPostCount() {
    this._http.get<number>(`${this.apiURL}/api/posts/count`).subscribe((postCount) => {
      this._postCount.next(postCount);
    });
  }

  private _setPosts(posts: Post[]): void {
    return this._postSource.next(posts);
  }

  public addPost(title: string, message: string, image: File): void {
    this.setPostLoadingStatus(true);
    try {
      const postData = new FormData();
      postData.append('title', title);
      postData.append('message', message);
      postData.append('image', image);

      this._http.post<Post>(`${this.apiURL}/api/posts`, postData).subscribe((post) => {
        const newPost: Post = {
          _id: post._id,
          ...post,
        };
        const newPosts = [...this.getPosts(), newPost];
        this._setPosts(newPosts);
      });
      this.setPostLoadingStatus(false);
    } catch (error) {
      console.log(error);
      this.setPostLoadingStatus(false);
    }
  }

  public deletePost(post: Post): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        ...post,
      },
    };

    return this._http.delete(`${this.apiURL}/api/posts`, options);
  }

  public getPost(postId: string) {
    return this._http.get<Post>(`${this.apiURL}/api/posts/${postId}`);
  }

  public updatePost(postId: string, title: string, message: string, image: string | File) {
    let postData: Post | FormData;

    switch (typeof image) {
      case 'object':
        postData = new FormData();
        postData.append('title', title);
        postData.append('message', message);
        postData.append('image', image, title);
        break;
      case 'string':
        postData = {
          _id: postId,
          title,
          message,
          imagePath: image,
        };
        break;
      default:
        throw new Error('Invalid image type: Image is not of type File or String');
    }

    this._http.put<Post>(`${this.apiURL}/api/posts/${postId}`, postData).subscribe((response) => {
      const currentPosts = this.getPosts();
      const targetPostIdx = currentPosts.findIndex((post) => post._id === postId);
      const updatedPost: Post = {
        _id: postId,
        title,
        message,
        imagePath: response.imagePath,
      };
      currentPosts[targetPostIdx] = updatedPost;
      this._setPosts(currentPosts);
    });
  }
}
