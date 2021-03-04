import { Post } from "../posts/models/post.model";

export interface User {
  username: string;
  posts: Post[];
}