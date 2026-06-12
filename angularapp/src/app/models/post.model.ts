import { User } from "./user.model";

export interface Post {
  id?: number;
  title: string;
  content: string;
  cat: string;
  createdAt: Date;
  user: User;
  img: string;
}
