import { Dispatch, createContext } from "react";

export type PostState = {
  id: string;
  isPending: boolean;
  reactionsSet: Set<string>;
};

export type PostActions =
  | { type: "SET_ID"; payload: { id: string } }
  | { type: "SET_IS_PENDING"; payload: { isPending: boolean } }
  | { type: "SET_REACTIONS_SET"; payload: { reactionsSet: Set<string> } };

export type PostStore = PostState & { dispatch: Dispatch<PostActions> };

const defaultInitState: PostStore = {
  id: "",
  isPending: false,
  reactionsSet: new Set(),

  dispatch: () => {},
};

export const PostContext = createContext<PostStore>(defaultInitState);
