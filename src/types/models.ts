export type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  createdAt: number;
  avatarUrl: string;
};

export type Post = {
  id: string;
  userId: string;
  content: string;
  media: Media[];
  createdAt: number;
  reactions: Reactions;
};

export type Reactions = {
  fire: number;
  poop: number;
  cap: number;
};

export type Media = {
  url: string;
  type: "image" | "video";
};

export type Comment = {
  id: string;
  userId: string;
  postId: string;
  parentId: string;
  content: string;
  media: Media[];
  createdAt: number;
  reactions: Reactions;
};

export type Like = {
  id: string;
  userId: string;
  postId?: string;
  commentId?: string;
  createdAt: number;
};
